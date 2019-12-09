import * as functions from 'firebase-functions'
import { firestore } from './../db/'

const axios = require('axios')

exports.all = functions.https.onCall(async (data, content) => {
  firestore.collection('articlefeeds').get().then(snap => {
    snap.docs.forEach(feed => {

    })
    axios
    .get("https://api.rss2json.com/v1/api.json", { params: { rss_url: 'https://www.medium.com/feed/real-church' } })
    .then(function(response) {

    })
  })

  let list = await firestore.collection('articlefeeds').get()
  let feeds = list.docs.map(e => e.data().url)

  return [].concat.apply([], (await Promise.all(feeds.map(e => {
    return axios
      .get('https://api.rss2json.com/v1/api.json', { params: { rss_url: e, api_key: functions.config().rss2json.key } })
      .then((res) => {
        return res.data
      })
  }))))
})