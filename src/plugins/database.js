import axios from 'axios'
import firebase from 'firebase'

axios.defaults.baseURL = 'https://database.unshiftingshadows.com'
axios.defaults.headers.post['Content-Type'] = 'application/json'

function list (type, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/list', {
      type: type,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

function view (type, id, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/view', {
      type: type,
      id: id,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data.resource, res.data.userData)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

function quotes (id, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/quotes', {
      id: id,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

function add (type, data, callback) {
  console.log('add: ' + type)
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/add', {
      type: type,
      data: data,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

function update (id, type, data, options, callback) {
  console.log('update id', id)
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/update', {
      id: id,
      type: type,
      data: data,
      updateUserData: options.updateUserData,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

function remove (id, type, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/remove', {
      id: id,
      type: type,
      token: idToken
    })
      .then((res) => {
        console.log(res.data)
        callback(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

export default ({ app, router, Vue }) => {
  Vue.prototype.database = {
    list: list,
    view: view,
    quotes: quotes,
    add: add,
    update: update,
    remove: remove
  }
}
