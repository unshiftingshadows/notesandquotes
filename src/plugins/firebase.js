import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import VueFiery from 'fiery-vue'

import { ALL_TYPES as types } from 'plugins/types'

const fbapp = firebase.initializeApp({
  apiKey: 'AIzaSyBRyXtYfwhda49puaaFlC0yThP1bpELPgI',
  authDomain: 'notes-and-quotes-977a3.firebaseapp.com',
  databaseURL: 'https://notes-and-quotes-977a3.firebaseio.com',
  projectId: 'notes-and-quotes-977a3',
  storageBucket: 'notes-and-quotes-977a3.appspot.com',
  messagingSenderId: '333897842731'
})

const firestore = firebase.firestore()
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)

function list (type) {
  return firestore.collection(type + 's')
}

function view (type, id) {
  return firestore.collection(type + 's').doc(id)
}

function snippets (type, id) {
  return {
    quotes: firestore.collection('quotes'),
    ideas: firestore.collection('ideas'),
    illustrations: firestore.collection('illustrations'),
    outlines: firestore.collection('outlines')
  }
}

async function lookup (term, type) {
  console.log('lookup called')
  var lookupFunction = firebase.functions().httpsCallable('lookup-' + type)
  const result = await lookupFunction({ searchTerm: term })
  console.log('lookup result', result)
  return result.data
}

var topicid = null
var topicResources = []

async function getTopicResources (id) {
  console.log('getTopicResources...')
  if (topicid === id) {
    return topicResources
  } else {
    topicid = id
    topicResources = new Promise((resolve, reject) => {
      firestore.collection('topics').doc(id).collection('resources').get().then((originalRes) => {
        var res = originalRes.docs.map(e => { return { id: e.id, ...e.data() } })
        console.log('resources acquired', res)
        var resProms = []
        res.forEach((resource) => {
          resProms.push(view(resource.type, resource.id).get())
        })
        return Promise.all(resProms).then((docs) => {
          var snipProms = []
          res.forEach((resource, index) => {
            resource.media = docs[index].data()
            if (types.SNIPPET.includes(resource.type)) {
              snipProms.push({
                prom: view(resource.media.mediaType, resource.media.mediaid).get(),
                index: index
              })
            }
          })
          if (snipProms.length > 0) {
            return Promise.all(snipProms.map(e => { return e.prom })).then((snips) => {
              snips.forEach((snipMedia, index) => {
                res[snipProms[index].index].media.media = snipMedia.data()
              })
              resolve(res)
            })
          } else {
            resolve(res)
          }
        })
        // console.log('resources loaded')
        // return res.docs.map(e => { return { id: e.id, ...e.data() } })
      }).catch((err) => {
        topicid = null
        topicResources = []
        console.error('topic resources error', err)
        resolve([])
      })
    })
    return topicResources
  }
}

function resetTopicResources () {
  topicid = null
  topicResources = []
}

export default ({ app, router, Vue }) => {
  Vue.use(VueFiery)
  Vue.prototype.$firebase = {
    auth: fbapp.auth(),
    db: fbapp.database(),
    store: firestore,
    searchTerms: fbapp.database().ref('searchTerms'),
    imagesRef: fbapp.storage().ref('images'),
    documentsRef: fbapp.storage().ref('documents'),
    list: list,
    view: view,
    snippets: snippets,
    lookup: lookup,
    getTopicResources,
    resetTopicResources
  }
}

export { fbapp }
