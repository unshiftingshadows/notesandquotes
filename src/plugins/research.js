// import something here
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var state = false
var resources = []
var listener

function getState () {
  return state
}

function setState (newState) {
  state = newState
  listener = firebase.firestore().collection('topics').doc(newState.id).collection('resources').onSnapshot((querySnap) => {
    querySnap.forEach((doc) => {
      resources.push(doc.data().id)
    })
  })
  return true
}

function cancelState () {
  state = false
  resources = []
  listener()
  return true
}

function findResource (res) {
  try {
    return resources.includes(res)
  } catch (err) {
    return false
  }
}

function addResource (res) {
  try {
    console.log('add resource', res)
    // state.resources.push(res)
    return firebase.firestore().collection('topics').doc(state.id).collection('resources').add({
      type: res.type,
      id: res.id,
      dateAdded: new Date(),
      addedBy: firebase.auth().currentUser.uid,
      used: false
    }).then(() => {
      return true
    })
  } catch (err) {
    return Promise.resolve(false)
  }
}

var events = {}

function on (event, callback) {
  console.log('event', event)
  console.log('callback', callback)
  events[event] = callback
  console.log('events', events)
}

function emit (event, data) {
  console.log('function?', events[event])
  events[event](data)
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$selectedTopic = {
    get: getState,
    set: setState,
    cancel: cancelState,
    find: findResource,
    add: addResource
  }
  Vue.prototype.$currentTopic = {
    on: on,
    emit: emit
  }
}
