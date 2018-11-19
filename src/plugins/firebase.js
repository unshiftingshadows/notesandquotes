import firebase from 'firebase/app'
import 'firebase/auth'
// import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import VueFiery from 'fiery-vue'

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
    snippets: snippets
  }
}
