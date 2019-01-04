import * as functions from 'firebase-functions'
import { firestore } from './../db'

const mediaTypes = [ 'book', 'movie', 'image', 'video', 'article', 'note', 'document', 'discourse', 'composition' ]
const snippetTypes = [ 'quote', 'idea', 'illustration', 'outline' ]

const typeList = {
  media: mediaTypes,
  snippet: snippetTypes
}

exports.all = functions.https.onCall(async (data, context) => {
  if (context.auth) {
    const tag = data.tag
    const media = await tagQuery(tag, 'media')
    const snippet = await tagQuery(tag, 'snippet')
    return { media, snippet }
  } else {
    return { error: 'Not authenticated...' }
  }
})

exports.media = functions.https.onCall(async (data, context) => {
  if (context.auth) {
    const tag = data.tag
    const media = await tagQuery(tag, 'media')
    return { media }
  } else {
    return { error: 'Not authenticated...' }
  }
})

exports.snippet = functions.https.onCall(async (data, context) => {
  if (context.auth) {
    const tag = data.tag
    const snippet = await tagQuery(tag, 'snippet')
    return { snippet }
  } else {
    return { error: 'Not authenticated...' }
  }
})

async function tagQuery (tag, type) {
  return await Promise.all(typeList[type].map(e => {
    return firestore.collection(e + 's').where('tags', 'array-contains', tag).get()
  }))
}