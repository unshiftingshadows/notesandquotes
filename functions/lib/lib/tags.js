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
const typeList = {
    media: mediaTypes,
    snippet: snippetTypes
};
exports.all = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    if (context.auth) {
        const tag = data.tag;
        const media = yield tagQuery(tag, 'media');
        const snippet = yield tagQuery(tag, 'snippet');
        return { media, snippet };
    }
    else {
        return { error: 'Not authenticated...' };
    }
}));
exports.media = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    if (context.auth) {
        const tag = data.tag;
        const media = yield tagQuery(tag, 'media');
        return { media };
    }
    else {
        return { error: 'Not authenticated...' };
    }
}));
exports.snippet = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    if (context.auth) {
        const tag = data.tag;
        const snippet = yield tagQuery(tag, 'snippet');
        return { snippet };
    }
    else {
        return { error: 'Not authenticated...' };
    }
}));
function tagQuery(tag, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(typeList[type].map(e => {
            return db_1.firestore.collection(e + 's').where('tags', 'array-contains', tag).get();
        }));
    });
}
//# sourceMappingURL=tags.js.map