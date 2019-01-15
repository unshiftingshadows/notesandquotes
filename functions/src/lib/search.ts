import * as functions from 'firebase-functions'
import { firestore } from './../db/'
const Fuse = require('fuse.js')

// const mediaTypes = [ 'book', 'movie', 'image', 'video', 'article', 'note', 'document', 'discourse', 'composition' ]
// const snippetTypes = [ 'quote', 'idea', 'illustration', 'outline' ]

exports.all = functions.https.onCall(async (data, context) => {
  if (context.auth) {
    const searchTerms: string = data.searchTerms
    const searchTypes: [string] = data.searchTypes

    console.log('searchTerms', searchTerms)
    console.log('searchTypes', searchTypes)

    const searchOptions = {
      shouldSort: true,
      findAllMatches: true,
      keys: [{
        name: 'tags',
        weight: 0.3
      }, {
        name: 'text',
        weight: 0.4
      }, {
        name: 'title',
        weight: 0.2
      }, {
        name: 'author',
        weight: 0.1
      }]
    }

    // Pull all firestore collections
    const allMedia = [].concat.apply([], (await Promise.all(searchTypes.map(e => { return firestore.collection(e + 's').get() }))).map((e, index) => {
      e.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          type: searchTypes[index]
        }
      })
    }))

    console.log('totalitems', allMedia.length)

    // Search through returned arrays
    const fuse = new Fuse(allMedia, searchOptions)

    // Return summed array
    return { searchTerms, searchTypes, results: fuse.search(searchTerms) }
  } else {
    return { error: 'User not authorized' }
  }
})

// exports.tags = functions.https.onCall(async (data, context) => {
//   const searchTags = data.searchTags

//   console.log('searchTags', searchTags)

//   const allMedia = mediaTypes.map(e => { return firestore.collection(e + 's') })
//   const allSnippets = snippetTypes.map(e => { return firestore.collection(e + 's') })

//   const allSearch = allMedia.concat(allSnippets).map(e => { return searchTags.map(f => { return e.where('tags', 'array-contains', f) }) })

//   const results = await Promise.all(allSearch)

//   return { searchTags, results }
// })