// const { getChart } = require('billboard-top-100')

// getChart('christian-albums', '2019-01-01', (err, chart) => {
//   if (err) console.log(err)
//   console.log(chart.songs)
// })

// const music = require('musicmatch')({ apikey: '1f868fb7a0e101d46da8ecb4e04ec8d7' })

// music.trackSearch({
//   'page': 0,
//   'page_size': 100,
//   'f_music_genre_id': 1103,
//   'f_lyrics_language': 'en',
//   's_track_rating': 'desc',
//   'quorum_factor': 1
// }).then((data) => {
//   console.log(data.message.body['track_list'])
// })

// music.album({ album_id: 19462531 }).then((data) => {
//   console.log(data.message.body.album)
// })

// const scrape = require('scrape-it')

// scrape('https://genius.com/Hillsong-worship-who-you-say-i-am-lyrics', { lyrics: '.lyrics' }).then(({ data, response }) => {
//   console.log('getLyrics', response.statusCode)
//   console.log(data.lyrics.replace(/\[(.*?)\n/g, ''))
//   return data
// })

const testLyrics = `Hold me now\nIn the hands that created the heavens\nFind me now\nWhere the grace runs as deep as Your scars\nYou pulled me from the clay\nYou set me on a rock\nCalled me by Your name\nAnd made my heart whole again\n\nLifted up\nAnd my knees know it's all for Your glory\nThat I might stand\nWith more reasons to sing than to fear\nYou pulled me from the clay\nSet me on a rock\nCalled me by Your name\nAnd made my heart whole again\n\nSo here I stand\nHigh in surrender\nI need You now\n\nHold my heart\nNow and forever\nMy soul cries out\n\nOnce I was broken\nBut You loved my whole heart through\nSin has no hold on me\n‘Cause Your grace holds me now\n\nAnd that grace\nOwns the ground where the grave did\nWhere all my shame remains\nLeft for dead in Your wake\nYou crashed those age-old gates\nYou left no stone unturned\nYou stepped out of that grave\nAnd shouldered me all the way\n\nSo here I stand\nHigh in surrender\nI need You now\n\nHold my heart\nNow and forever\nMy soul cries out\n\nOnce I was broken\nBut You loved my whole heart through\nSin has no hold on me\n‘Cause Your grace holds me now\n\nHealed and forgiven\nLook where my chains are now\nDeath has no hold on me\n‘Cause Your grace holds that ground\nAnd Your grace holds me now\nYour grace holds me now\nYour grace holds me now\nYour grace holds me now\n\nSo here I stand\nHigh in surrender\nI need You now\n\nHold my heart\nNow and forever\nMy soul cries out\n\nHere I stand\nHigh in surrender\nI need You now\n\nHold my heart\nNow and forever\nMy soul cries out\n\nHere I stand\nHigh in surrender\nI need You now\n\nHold my heart\nNow and forever\nMy soul cries out\n\nHere I stand\nHigh in surrender\nI need You now\n\nHold my heart\nNow and forever\nMy soul cries out\n\nOnce I was broken\nBut You loved my whole heart through\nSin has no hold on me\n‘Cause Your grace holds me now\n\nHealed and forgiven\nLook where my chains are now\nDeath has no hold on me\n‘Cause Your grace holds that ground\nAnd Your grace holds me now\nYour grace holds me now\nYour grace holds me now\nYour grace holds me now\n\nHealed and forgiven\nLook where my chains are now\nDeath has no hold on me\n‘Cause Your grace holds that ground\nAnd Your grace holds me now`

const testTitle = 'Whole Heart (Hold Me Now)'

const lists = require('./words.json').lists

const normalize = {
  'i ll': `i'll`,
  //'ill': `i'll`,
  'theyre': `they're`,
  'youre': `you're`,
  'they re': `they're`,
  'you re': `you're`
}

// const words = {
//   self: [],
//   god: [],
//   second: [],
//   third: [],
//   keywords: [],
//   water: [],
//   theology: [],
//   bird: [],
//   fhl: ['faith', 'hope', 'love']
// }

// Test full analysis functionality here to ensure it works properly before having to constantly upload cloud functions...
function analysisSimilarity (lyrics, title) {
  return new Promise((resolve, reject) => {
    let results = {}
    let words = []
    let wordsu = {}
    let phrases = []
    let phrasesu = []
    // Parse individual words, removing punctuation and white space
    //   include running a list of unique words with their frequency
    //   also, normalize words along the way
    //   ex: ill -> i'll
    //       i ll -> i'll
    //   look for odd punctuation marks...ex. " - "
    //   leave ' for 'cause in order to differentiate from cause
    words = lyrics.replace(/(”|“|")/g, '').trim().toLowerCase().split(/\n|\ /).filter(e => e !== '')

    results.totalWords = words.length

    // Get unique words
    for (var word of words) {
      if (wordsu[word] > 0) {
        wordsu[word]++
      } else {
        wordsu[word] = 1
      }
    }

    results.uniqueWords = Object.keys(wordsu).length

    // Parse individual phrases
    //   include running a list of unique phrases with their frequency
    const len = words.length - 1
    let lastMatch = false
    for (let i = 0; i < len; i++) {
      for (var y = len; y >= len - i; y--) {
        var x = i - (len - y)
        if (x > len || y > len) {
          console.error('wrong length...', x, y)
        }
        if (x === y) {
          console.log('something went wrong...')
        }
        if (words[x] === words[y]) {
          if (lastMatch) {
            phrases[phrases.length - 1].text = `${words[y]} ${phrases[phrases.length - 1].text}`
            phrases[phrases.length - 1].length++
            phrases[phrases.length - 1].boxes.push({
              x: x,
              y: y,
              key: `${x}-${y}-${words[y]}`,
              word: words[y],
              index: y
            })
          } else {
            phrases.push({
              text: words[y],
              length: 1,
              boxes: [{
                x: x,
                y: y,
                key: `${x}-${y}-${words[y]}`,
                word: words[y],
                index: y
              }],
              instances: [ x, y ],
              startPos: `${x}-${y}`
            })
            lastMatch = true
          }
        } else {
          if (lastMatch) {
            var index = phrasesu.map(e => e.text).indexOf(phrases[phrases.length - 1].text)
            if (index === -1) {
              phrasesu.push({
                ...(phrases[phrases.length - 1]),
                frequency: 1
              })
            } else {
              phrasesu[index].frequency++
              phrasesu[index].boxes = phrasesu[index].boxes.concat(phrases[phrases.length - 1].boxes)
              phrases[phrases.length - 1].instances.forEach(z => {
                if (phrasesu[index].instances.indexOf(z) === -1) {
                  phrasesu[index].instances.push(z)
                }
              })
            }
          }
          lastMatch = false
        }
      }
    }

    results.totalPhrases = phrases.length

    // Add single line words
    phrasesu = phrasesu.concat(words.map((e, index) => {
      return {
        text: e,
        length: 0,
        boxes: [{
          x: index,
          y: index,
          key: `${index}-${index}-${e}`,
          word: e,
          index: index
        }],
        instances: [ index ],
        startPos: `${index}-${index}`,
        frequency: 1
      }
    }))

    results.uniquePhrases = phrasesu.length

    // Generate some stats:
    // - frequency of title in lyrics (maybe find it as a phrase?)
    let titleCount = 0
    const titleParts = title.toLowerCase().split('(')
    if (titleParts.length > 1) titleParts[titleParts.length - 1] = titleParts[titleParts.length - 1].replace(')','')
    for (let part of titleParts) {
      const partWords = part.split(' ').filter(e => e !== '')
      for (let [index, word] of words.entries()) {
        if (word === partWords[0] || word === partWords[0] + 's') {
          if (partWords.reduce((acc, e, i) => {
            acc = e === words[index + i] || e + 's' === words[index + i]
            return acc
          }, false)) {
            titleCount++
          }
        }
      }
    }
    results.freqTitle = titleCount
    // - unique words / total words
    results.scoreRepWords = Object.keys(wordsu).length / words.length
    // - unique phrases / total phrases
    results.scoreRepPhrases = phrasesu.length / phrases.length
    // - self words frequency
    // - 2nd person words frequency
    // - 3rd person words frequency
    results.wordCounts = {
      first: words.filter(e => lists.firstPerson.set.indexOf(e) > -1).length,
      second: words.filter(e => lists.secondPerson.set.indexOf(e) > -1).length,
      third: words.filter(e => lists.thirdPerson.set.indexOf(e) > -1).length
    }
    // - God words frequency
    // - list "significant phrases" based on keywords, include frequency
    //   include phrase length to limit based on length later
    //           indexes where the phrase was used
    //   ex. { phrase: 'this is a significant phrase', keyword: 'significant', frequency: 12, length: 5, instances: [ 0, 24, 47 ] }

    // Run similarity matrix algorithm

    // Generate SVG

    // Store SVG

    // Return SVG storage location and ALL stats
    console.log()
    resolve(results)
  })
}

async function runAnalysis () {
  try {
    var results = await analysisSimilarity(testLyrics, testTitle)
    console.log('results', results)
  } catch (err) {
    console.log('some error thrown', err)
  }
}

runAnalysis()