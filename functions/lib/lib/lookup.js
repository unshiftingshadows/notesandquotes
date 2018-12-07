"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const axios = require('axios');
exports.book = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    const searchTerm = data.searchTerm;
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
    const res = yield axios({
        method: 'get',
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerm + '&country=US',
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    const results = res.data;
    return results;
}));
exports.movie = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    const searchTerm = data.searchTerm;
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
    const res = yield axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=' + functions.config().moviedb.key + '&query=' + searchTerm,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-api-key': functions.config().mercury.key
        }
    });
    const results = res.data;
    return results;
}));
//# sourceMappingURL=lookup.js.map