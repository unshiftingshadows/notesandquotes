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
const _1 = require("./../db/");
const Fuse = require('fuse.js');
// const mediaTypes = [ 'book', 'movie', 'image', 'video', 'article', 'note', 'document', 'discourse', 'composition' ]
// const snippetTypes = [ 'quote', 'idea', 'illustration', 'outline' ]
exports.all = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    if (context.auth) {
        const searchTerms = data.searchTerms;
        const searchTypes = data.searchTypes;
        console.log('searchTerms', searchTerms);
        console.log('searchTypes', searchTypes);
        const searchOptions = {
            shouldSort: true,
            findAllMatches: true,
            keys: [{
                    name: 'tags',
                    weight: 0.3
                }, {
                    name: 'text',
                    weight: 0.4
                }, {
                    name: 'title',
                    weight: 0.2
                }, {
                    name: 'author',
                    weight: 0.1
                }]
        };
        // Pull all firestore collections
        const allMedia = [].concat.apply([], (yield Promise.all(searchTypes.map(e => { return _1.firestore.collection(e + 's').get(); }))).map((e, index) => {
            e.docs.map((doc) => {
                return Object.assign({}, doc.data(), { id: doc.id, type: searchTypes[index] });
            });
        }));
        console.log('totalitems', allMedia.length);
        // Search through returned arrays
        const fuse = new Fuse(allMedia, searchOptions);
        // Return summed array
        return { searchTerms, searchTypes, results: fuse.search(searchTerms) };
    }
    else {
        return { error: 'User not authorized' };
    }
}));
// exports.tags = functions.https.onCall(async (data, context) => {
//   const searchTags = data.searchTags
//   console.log('searchTags', searchTags)
//   const allMedia = mediaTypes.map(e => { return firestore.collection(e + 's') })
//   const allSnippets = snippetTypes.map(e => { return firestore.collection(e + 's') })
//   const allSearch = allMedia.concat(allSnippets).map(e => { return searchTags.map(f => { return e.where('tags', 'array-contains', f) }) })
//   const results = await Promise.all(allSearch)
//   return { searchTags, results }
// })
//# sourceMappingURL=search.js.map