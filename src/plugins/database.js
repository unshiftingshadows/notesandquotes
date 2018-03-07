import axios from 'axios'
import firebase from 'firebase'

axios.defaults.baseURL = 'https://database.unshiftingshadows.com'
axios.defaults.headers.post['Content-Type'] = 'application/json'

function testList (data, callback) {
  axios.post('/list', data)
    .then((res) => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

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

export default ({ app, router, Vue }) => {
  Vue.prototype.database = {
    test: testList,
    list: list
  }
}
