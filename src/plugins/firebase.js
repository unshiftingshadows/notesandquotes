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

export default ({ app, router, Vue }) => {
  Vue.prototype.firebase = {
    auth: fbapp.auth(),
    db: fbapp.database(),
    store: fbapp.firestore(),
    searchTerms: fbapp.database().ref('searchTerms'),
    quotes: fbapp.firestore().collection('quotes'),
    books: fbapp.firestore().collection('books')
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
