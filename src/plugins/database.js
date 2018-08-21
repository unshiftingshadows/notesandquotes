import axios from 'axios'
import firebase from 'firebase'

axios.defaults.baseURL = 'https://database.unshiftingshadows.com/nq'
axios.defaults.headers.post['Content-Type'] = 'application/json'

function list (type, filter, sort, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/list', {
      type: type,
      filter: filter,
      sort: sort,
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
        console.error(err)
      })
  })
}

function snippets (type, id, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/snippets', {
      type: type,
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

function lookup (searchTerm, type, callback) {
  console.log('lookup', searchTerm, type)
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/lookup', {
      type: type,
      searchTerm: searchTerm,
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

function resources (type, id, callback) {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
    axios.post('/resources', {
      id: id,
      type: type,
      token: idToken
    })
      .then((res) => {
        // console.log(res.data.resources)
        callback(res.data.resources)
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
    snippets: snippets,
    add: add,
    update: update,
    lookup: lookup,
    remove: remove,
    resources: resources
  }
}
