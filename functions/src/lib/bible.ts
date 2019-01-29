import * as functions from 'firebase-functions'
const bcv_parser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser
const axios = require('axios')

function getESV(parsedRef) {
  return axios.get('https://api.esv.org/v3/passage/text/?q=' + parsedRef.osis(), {
    params: {
      'include-passage-references': false,
      'include-first-verse-numbers': false,
      'include-verse-numbers': false,
      'include-footnotes': false,
      'include-footnote-body': false,
      'include-short-copyright': false,
      'include-copyright': false,
      'include-passage-horizontal-lines': false,
      'include-heading-horizontal-lines': false,
      'include-headings': false
    },
    headers: {
      'Authorization': functions.config().esv.key
    }
  })
  .then((data) => {
    return {
      parse: parsedRef,
      text: data.data.passages.join('...')
    }
  })
  .catch((err) => {
    // Sentry.captureException(err)
    throw err
  })
}

exports.text = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    // Sentry.captureException(Error('Cloud Function (bibleText) - The function must be called while authenticated'))
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }
  // functions.config().someservice.id
  const ref = data.bibleRef
  console.log('ref', ref)

  const bcv = new bcv_parser
  const parsedRef = bcv.parse(ref)

  return getESV(parsedRef)
    .then(async (finalData) => {
      // log('bible', {
      //   category: 'bible',
      //   action: 'text',
      //   label: version,
      //   value: ref
      // }, {
      //   uid: context.auth.uid,
      //   username: (await admin.auth().getUser(context.auth.uid)).displayName,
      //   email: (await admin.auth().getUser(context.auth.uid)).email,
      //   ip: context.rawRequest.ip
      // })
      // Sentry.addBreadcrumb({
      //   category: 'bible',
      //   message: `Cloud Function (bibleText) - ESV text retrieved successfully`,
      //   level: 'info'
      // })
      return finalData
    })
    .catch((err) => {
      // Sentry.captureException(err)
      return {
        err: err
      }
    })
})