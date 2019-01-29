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
const db_1 = require("./../db");
const mediaTypes = ['book', 'movie', 'image', 'video', 'article', 'note', 'document', 'discourse', 'composition'];
const snippetTypes = ['quote', 'idea', 'illustration', 'outline'];
function updateIndex(type, id, data) {
    if (data === null) {
        return db_1.db.ref(`searchIndex/${type}/${id}`).remove();
    }
    else {
        let promises = [
            db_1.db.ref(`searchIndex/${type}/${id}`).set({
                title: data.title ? data.title : '',
                author: data.author ? data.author.join(',') : '',
                tags: data.tags ? data.tags.join(',') : '',
                bibleRefs: data.bibleRefs ? data.bibleRefs.join(',') : ''
            })
        ];
        if (data.tags) {
            promises = promises.concat(data.tags.map(e => {
                return db_1.db.ref(`tagIndex/${e.replace('.', '').replace('/', '-')}`).set(true);
            }));
        }
        return Promise.all(promises);
    }
}
function updateIndexSnippet(type, id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data === null) {
            return db_1.db.ref(`searchIndexSnippet/${type}/${id}`).remove();
        }
        else {
            const media = yield db_1.firestore.collection(data.mediaType + 's').doc(data.mediaid).get();
            const mediaData = media.data();
            let promises = [
                db_1.db.ref(`searchIndexSnippet/${type}/${id}`).set({
                    tags: data.tags ? data.tags.join(',') : '',
                    bibleRefs: data.bibleRefs ? data.bibleRefs.join(',') : '',
                    text: data.text ? data.text : data.points ? data.points.join(',') : '',
                    title: mediaData.title ? mediaData.title : '',
                    author: mediaData.author ? mediaData.author.join(',') : ''
                })
            ];
            if (data.tags) {
                promises = promises.concat(data.tags.map(e => {
                    return db_1.db.ref(`tagIndex/${e.replace('.', '').replace('/', '-')}`).set(true);
                }));
            }
            return Promise.all(promises);
        }
    });
}
// exports.book = functions.firestore.document('books/{bookid}').onWrite((change, context) => { return updateIndex ('book', context.params.bookid, change.after.exists ? change.after.data() : null) })
// exports.movie = functions.firestore.document('movies/{movieid}').onWrite((change, context) => { return updateIndex ('movie', context.params.movieid, change.after.exists ? change.after.data() : null) })
// exports.image = functions.firestore.document('images/{imageid}').onWrite((change, context) => { return updateIndex ('image', context.params.imageid, change.after.exists ? change.after.data() : null) })
// exports.video = functions.firestore.document('videos/{videoid}').onWrite((change, context) => { return updateIndex ('video', context.params.videoid, change.after.exists ? change.after.data() : null) })
// exports.article = functions.firestore.document('articles/{articleid}').onWrite((change, context) => { return updateIndex ('article', context.params.articleid, change.after.exists ? change.after.data() : null) })
// exports.note = functions.firestore.document('notes/{noteid}').onWrite((change, context) => { return updateIndex ('note', context.params.noteid, change.after.exists ? change.after.data() : null) })
// exports.document = functions.firestore.document('documents/{documentid}').onWrite((change, context) => { return updateIndex ('document', context.params.documentid, change.after.exists ? change.after.data() : null) })
// exports.discourse = functions.firestore.document('discourse/{discourseid}').onWrite((change, context) => { return updateIndex ('discourse', context.params.discourseid, change.after.exists ? change.after.data() : null) })
// exports.composition = functions.firestore.document('composition/{compositionid}').onWrite((change, context) => { return updateIndex ('composition', context.params.compositionid, change.after.exists ? change.after.data() : null) })
// exports.updateQuote = functions.firestore.document('quotes/{quoteid}').onWrite((change, context) => { return updateIndexSnippet ('quote', context.params.quoteid, change.after.exists ? change.after.data() : null) })
// exports.updateIdea = functions.firestore.document('ideas/{ideaid}').onWrite((change, context) => { return updateIndexSnippet ('idea', context.params.ideaid, change.after.exists ? change.after.data() : null) })
// exports.updateIllustration = functions.firestore.document('illustrations/{illustrationid}').onWrite((change, context) => { return updateIndexSnippet ('illustration', context.params.illustrationid, change.after.exists ? change.after.data() : null) })
// exports.updateOutline = functions.firestore.document('outlines/{outlineid}').onWrite((change, context) => { return updateIndexSnippet ('outline', context.params.outlineid, change.after.exists ? change.after.data() : null) })
mediaTypes.forEach(e => {
    exports[e] = functions.firestore.document(`${e}s/{${e}id}`).onWrite((change, context) => { return updateIndex(e, context.params[`${e}id`], change.after.exists ? change.after.data() : null); });
});
snippetTypes.forEach(e => {
    exports[e] = functions.firestore.document(`${e}s/{${e}id}`).onWrite((change, context) => { return updateIndexSnippet(e, context.params[`${e}id`], change.after.exists ? change.after.data() : null); });
});
//# sourceMappingURL=indexing.js.map