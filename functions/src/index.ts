// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const Sentry = require('@sentry/node')
Sentry.init({
  dsn: 'https://2dcec54e3241491d977d725376fb86bf@sentry.io/1380085',
  environment: 'server'
})

exports.add = require('./lib/add')
exports.lookup = require('./lib/lookup')
exports.search = require('./lib/search')
exports.index = require('./lib/indexing')
exports.tags = require('./lib/tags')