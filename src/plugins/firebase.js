import firebase from 'firebase'
require('firebase/firestore')

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

export default ({ app, router, Vue }) => {
  Vue.prototype.firebase = {
    auth: fbapp.auth(),
    db: fbapp.database(),
    store: firestore,
    searchTerms: fbapp.database().ref('searchTerms'),
    imagesRef: fbapp.storage().ref('images'),
    documentsRef: fbapp.storage().ref('documents')
  }
  // Vue.prototype.$searchTerms = fbapp.database().ref('searchTerms')
  // Vue.prototype.$firestore = fbapp.firestore()

  // app.firebase = firebase.initializeApp({
  //   apiKey: 'AIzaSyBRyXtYfwhda49puaaFlC0yThP1bpELPgI',
  //   authDomain: 'notes-and-quotes-977a3.firebaseapp.com',
  //   databaseURL: 'https://notes-and-quotes-977a3.firebaseio.com',
  //   projectId: 'notes-and-quotes-977a3',
  //   storageBucket: 'notes-and-quotes-977a3.appspot.com',
  //   messagingSenderId: '333897842731'
  // })
}
