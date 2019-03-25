import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import VueFiery from 'fiery-vue'
// import duix from 'duix'

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

var topicResources = {}

async function getTopicResources (id) {
  console.log('getTopicResources...')
  if (topicResources[id]) {
    return topicResources[id]
  } else {
    topicResources[id] = {}
    topicResources[id] = new Promise((resolve, reject) => {
      firestore.collection('topics').doc(id).collection('resources').get().then((originalRes) => {
        var res = originalRes.docs.map(e => { return { key: e.id, ...e.data() } })
        console.log('resources acquired', res)
        var resProms = []
        res.forEach((resource) => {
          resProms.push(view(resource.type, resource.id).get())
        })
        return Promise.all(resProms).then((docs) => {
          console.log('all docs', docs)
          var snipProms = []
          res.forEach((resource, index) => {
            if (!docs[index].exists) {
              console.log(docs[index], '!!!!does not exist!!!!!')
              firestore.collection('topics').doc(id).collection('resources').doc(resource.key).delete()
              return
            }
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
        topicResources[id] = false
        console.error('topic resources error', err)
        resolve([])
      })
    })
    return topicResources[id]
  }
}

async function useTopicResource (topicid, id) {
  console.log('use resource', id, await topicResources[topicid])
  const currentResources = await topicResources[topicid]
  const index = currentResources.findIndex(e => { return e.key === id })
  console.log('index', index)
  currentResources[index].used = true
  firestore.collection('topics').doc(topicid).collection('resources').doc(id).update({
    used: true
  })
}

async function unuseTopicResource (topicid, id) {
  const currentResources = await topicResources[topicid]
  const index = currentResources.findIndex(e => { return e.key === id })
  console.log('index', index)
  currentResources[index].used = false
  firestore.collection('topics').doc(topicid).collection('resources').doc(id).update({
    used: false
  })
}

function resetTopicResources () {
  topicResources = {}
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
    useTopicResource,
    unuseTopicResource,
    resetTopicResources
  }
}

export { fbapp }
