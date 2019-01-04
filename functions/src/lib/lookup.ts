import * as functions from 'firebase-functions'

const axios = require('axios')

exports.book = functions.https.onCall(async (data, context) => {
  if (context.auth) {
    const searchTerm = data.searchTerm
    // https.get('https://www.googleapis.com/books/v1/volumes?q=' + searchTerm + '&country=US', (res) => {
    //   let bookData = ''
    //   res.on('data', (chunk) => {
    //     bookData += chunk
    //   })
    //   res.on('end', () => {
    //     const results = JSON.parse(bookData)
    //     console.log(results)
    //     return results
    //   })
    // }).on('error', (err) => {
    //   console.log('Error: ' + err.message)
    //   return { message: 'Some error in searching', err: err }
    // })
    const res = await axios({
      method: 'get',
      url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerm + '&country=US',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    const results = res.data
    return results
  } else {
    return { error: 'Not authenticated...' }
  }
})

exports.movie = functions.https.onCall(async (data, context) => {
  if (context.auth) {
    const searchTerm = data.searchTerm
    // https.get('https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=' + functions.config().moviedb.key + '&query=' + searchTerm, (res) => {
    //   let movieData = ''
    //   res.on('data', (chunk) => {
    //     movieData += chunk
    //   })
    //   res.on('end', () => {
    //     const results = JSON.parse(movieData)
    //     console.log(results)
    //     return results
    //   })
    // }).on('error', (err) => {
    //   console.log('Error: ' + err.message)
    //   return { message: 'Some error in searching', err: err }
    // })
    const res = await axios({
      method: 'get',
      url: 'https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=' + functions.config().moviedb.key + '&query=' + searchTerm,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-api-key': functions.config().mercury.key
      }
    })
    const results = res.data
    return results
  } else {
    return { error: 'Not authenticated...' }
  }
})