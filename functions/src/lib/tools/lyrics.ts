import * as functions from 'firebase-functions'
import { firestore } from './../../db/'

const lyricRef = firestore.collection('tools').doc('lyricAnalysis')

const { getChart } = require('billboard-top-100')
const musixmatch = require('musicmatch')({ apikey: functions.config().musixmatch.key })
const geniusApi = require('genius-api')
const genius = new geniusApi(functions.config().genius.key)
const scrape = require('scrape-it')

function updateStats(transactions) {
  firestore.runTransaction(t => {
    return t.get(lyricRef)
      .then(doc => {
        // Update various fields
        let updates = {
          stats: doc.data().stats
        }
        updates.stats.count = updates.stats.count + transactions.reduce((acc, e) => acc + e.val, 0)
        for (let trans of transactions) {
          updates.stats[trans.cat].count = updates.stats[trans.cat].count + transactions.reduce((acc, e) => acc + e.val, 0)
          if (trans.year === '') {
            updates.stats[trans.cat].years.unknown.count = updates.stats[trans.cat].years.unknown.count + trans.val
          } else {
            updates.stats[trans.cat].years[trans.year].count = (updates.stats[trans.cat].years[trans.year].count || 0) + trans.val
          }
        }
        t.update(lyricRef, updates)
      })
  }).then(result => {
    console.log('transaction success!')
    return true
  }).catch(err => {
    console.log('transaction failture', err)
    return false
  })
}

function getBillboard(year, month) {
  return new Promise((resolve, reject) => {
    getChart('christian-songs', `${year}-${month}-01`, (err, chart) => {
      if (err) reject(err)
      resolve(chart.songs)
    })
  })
}

function getMusix(page, cat) {
  return musixmatch.trackSearch({
    'page': page,
    'page_size': 100,
    'f_music_genre_id': cat,
    'f_has_lyrics': 1,
    'f_lyrics_language': 'en',
    's_track_rating': 'desc',
    'quorum_factor': 1
  }).then((data) => {
    return data.message.body.track_list
  })
}

function getMusixAlbum(id) {
  return musixmatch.album({ album_id: id }).then((data) => {
    return data.message.body.album
  })
}

function searchSong(title, artist) {
  return genius.search(title + ' ' + artist).then((res) => {
    const mapped = res.hits.map(f => f.result)
    console.log('searchSong', mapped, res.hits.length)
    return mapped.filter(e => e.title.indexOf(title) > -1)[0] || mapped[0]
  })
}

function getLyrics(geniusurl) {
  return scrape(geniusurl, { lyrics: '.lyrics' }).then(({ data, response }) => {
    console.log('getLyrics', response.statusCode, data)
    return data.lyrics.replace(/\[(.*?)\n/g, '')
  })
}

exports.listBillboard = functions.https.onCall(async (data, context) => {
  const year = data.year
  const month = data.month
  return getChart(year, month)
})

exports.addBillboard = functions.https.onCall(async (data, context) => {
  const year = data.year
  const month = data.month
  const songs = await getChart(year, month)
  // Then what?...
})

exports.listMusix = functions.https.onCall(async (data, context) => {
  const page = data.page
  const cat = data.cat
  return getMusix(page, cat)
})

exports.addMusix = functions.https.onCall(async (data, context) => {
  try {
    const page = data.page
    const cat = data.cat
    const songs = (await getMusix(page, cat)).map(e => e.track)
    let results = 0
    let idChecks = 0
    let otherChecks = 0
    for (let song of songs) {
      const idCheck = (await lyricRef.collection('songs').where('mmid', '==', song.track_id).get()).size === 0
      if (idCheck) {
        idChecks += 1
        const searchName = song.track_name.replace(' (Radio Version)'. '').replace(' (Live)', '')
        const check = (await lyricRef.collection('songs').where('title', '==', searchName).get()).size === 0
        if (check) {
          otherChecks += 1
          const year = await lyricRef.collection('albums').doc(song.album_id.toString()).get()
            .then(async snap => {
              if (!snap.data().name) {
                const album = await getMusixAlbum(song.album_id)
                lyricRef.collection('albums').doc(song.album_id.toString()).set({
                  artist: album.artist_name,
                  mmartistid: album.artist_id,
                  name: album.album_name,
                  copyright: album.album_copyright,
                  release: album.album_release_date,
                  year: album.album_release_date.split('-')[0]
                })
              }
              return snap.data().year
            }).catch(async err => {
              const album = await getMusixAlbum(song.album_id)
              lyricRef.collection('albums').doc(song.album_id.toString()).set({
                artist: album.artist_name,
                mmartistid: album.artist_id,
                name: album.album_name,
                copyright: album.album_copyright,
                release: album.album_release_date,
                year: album.album_release_date.split('-')[0]
              })
              return album.album_release_date.split('-')[0]
            })
          updateStats([
            {
              cat: cat,
              year: year,
              val: 1
            }
          ])
          results += 1
          const tempSong = {
            mmid: song.track_id,
            title: song.track_name,
            artist: song.artist_name,
            mmartistid: song.artist_id,
            mmrating: song.track_rating,
            cat: cat,
            year: year,
            lyrics: {
              status: 0
            },
            analysis: {
              status: 0
            },
            musixRun: true
          }
          console.log('tempSong', tempSong)
          lyricRef.collection('songs').add(tempSong)
        }
      }
    }
    return { status: 200, results: results, id: idChecks, other: otherChecks }
  } catch (err) {
    console.log('problem...', err)
    return err
  }
})

exports.runLyrics = functions.https.onCall(async (data, context) => {
  console.log(`run lyrics on ${data.songs.length}`)
  return Promise.all(data.songs.map(e => {
    return new Promise(async (resolve, reject) => {
      try {
        const terms = e.title
        const song = await searchSong(terms, e.artist)
        console.log('found song?', song)
        if (song === undefined) throw new Error('song not found on Genius')
        const url = song.url
        const lyrics = await getLyrics(url)
        lyricRef.collection('songs').doc(e.id).update({
          lyrics: {
            gid: song.id,
            gurl: song.url,
            text: lyrics,
            status: 2
          }
        }).then(() => {
          resolve({ id: e.id, status: 200 })
        })
      } catch (err) {
        lyricRef.collection('songs').doc(e.id).update({
          lyrics: {
            error: err,
            status: 3
          }
        })
        resolve({ id: e.id, status: 400, error: err })
      }
    })
  })).catch(err => {
    console.error('possible unhandled exception...', err)
  })
})

function analysisSimilarity (lyrics, title) {
  return new Promise((resolve, reject) => {
    let results = {}
    let words = []
    let wordsu = []
    let phrases = []
    let phrasesu = []
    // Parse individual words, removing punctuation and white space
    //   include running a list of unique words with their frequency
    //   also, normalize words along the way
    //   ex: ill -> i'll
    //       i ll -> i'll

    // Parse individual phrases
    //   include running a list of unique phrases with their frequency

    // Generate some stats:
    // - frequency of title in lyrics (maybe find it as a phrase?)
    // - unique words / total words
    // - unique phrases / total phrases
    // - self words frequency
    // - God words frequency
    // - 2nd person words frequency
    // - 3rd person words frequency
    // - list "significant phrases" based on keywords, include frequency
    //   include phrase length to limit based on length later

    // Run similarity matrix algorithm

    // Generate SVG

    // Store SVG

    // Return SVG storage location and ALL stats
    resolve(results)
  })
}

function analysisNaturalLanguage (lyrics) {
  return new Promise((resolve, reject) => {
    let results = {}
    // Run entity sentiment

    // Save all entities in subcollection

    // Generate stats saved in the song document
    // - top 5 entities by magnitude
    // - top 5 negative entities
    // - top 5 positive entities
    // - total # of entities

    // Run document sentiment

    // Save all sentences in subcollection

    // Generate stats saved in the song document
    // - overall sentiment score and magnitude
    // - top negative sentence
    // - top positive sentence
    // - top sentence by magnitude

    // Return all stats
    resolve(results)
  })
}

exports.runAnalysis = functions.https.onCall(async (data, context) => {
  for (let doc of data.songs) {
    if (doc.lyricsRun === true) {
      let updates = await Promise.all([
        analysisSimilarity(doc.lyrics, doc.title),
        analysisNaturalLanguage(doc.lyrics)
      ]).then(res => {
        return {
          similarity: res[0],
          naturalLanguage: res[1]
        }
      }).catch(err => {
        console.error('analysis failed', err)
        return false
      })
      if (updates) {
        lyricRef.collection('songs').doc(doc.id)
      }
    }
  }
})