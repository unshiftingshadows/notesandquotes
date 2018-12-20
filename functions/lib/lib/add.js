"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// import { auth, firestore } from './../db/'
const axios = require('axios');
const getVideoId = require("get-video-id");
const htmlToText = require("html-to-text");
// import * as NQTypes from './types'
// const { Book, Movie, Image, Video, Article, Note, Document, Discourse, Composition } = NQTypes.MediaClasses
// const { Quote, Idea, Illustration, Outline } = NQTypes.SnippetClasses
function parseDuration(duration) {
    let a = duration.match(/\d+/g);
    if (duration.indexOf('M') >= 0 && duration.indexOf('H') === -1 && duration.indexOf('S') === -1) {
        a = [0, a[0], 0];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1 && duration.indexOf('S') === -1) {
        a = [a[0], 0, 0];
    }
    let newDuration = 0;
    if (a.length === 3) {
        newDuration = newDuration + parseInt(a[0]) * 3600;
        newDuration = newDuration + parseInt(a[1]) * 60;
        newDuration = newDuration + parseInt(a[2]);
    }
    if (a.length === 2) {
        newDuration = newDuration + parseInt(a[0]) * 60;
        newDuration = newDuration + parseInt(a[1]);
    }
    if (a.length === 1) {
        newDuration = newDuration + parseInt(a[0]);
    }
    return newDuration;
}
function videoInfoSearch(videoURL) {
    // Get video info
    const videoInfo = getVideoId(videoURL);
    if (videoInfo.service === 'youtube') {
        return axios({
            method: 'get',
            url: 'https://www.googleapis.com/youtube/v3/videos?key=' + functions.config().youtube.key + '&part=snippet,contentDetails,player&id=' + videoInfo.id,
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then((videoRes) => {
            const youtubeInfo = videoRes.data.items[0];
            console.log(youtubeInfo.snippet);
            return axios({
                method: 'get',
                url: 'https://www.googleapis.com/youtube/v3/channels?key=' + functions.config().youtube.key + '&part=snippet&id=' + youtubeInfo.snippet.channelId,
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then((channelRes) => {
                const channelInfo = channelRes.data.items[0];
                console.log(channelInfo);
                return {
                    title: youtubeInfo.snippet.title,
                    author: [channelInfo.snippet.title],
                    authorURL: 'https://www.youtube.com/channel/' + channelInfo.id,
                    description: youtubeInfo.snippet.description,
                    duration: parseDuration(youtubeInfo.contentDetails.duration),
                    embedURL: 'https://www.youtube.com/embed/' + youtubeInfo.id,
                    embedHTML: youtubeInfo.player.embedHtml,
                    thumbURL: youtubeInfo.snippet.thumbnails.standard ? youtubeInfo.snippet.thumbnails.standard.url : youtubeInfo.snippet.thumbnails.high.url,
                    postDate: new Date(youtubeInfo.snippet.publishedAt),
                    source: 'youtube',
                    pageURL: videoURL,
                    videoID: youtubeInfo.id
                };
            }).catch((err) => {
                console.error('error in youtubechannel pull', err);
                throw err;
            });
        }).catch((err) => {
            console.error('error in youtubeinfo pull', err);
            throw err;
        });
    }
    else if (videoInfo.service === 'vimeo') {
        return axios({
            method: 'get',
            url: 'https://api.vimeo.com/videos/' + videoInfo.id + '?access_token=' + functions.config().vimeo.key,
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then((res) => {
            const vimeoInfo = res.data;
            console.log(vimeoInfo);
            return {
                title: vimeoInfo.name,
                author: [vimeoInfo.user.name],
                authorURL: vimeoInfo.user.link,
                description: vimeoInfo.description,
                duration: vimeoInfo.duration,
                embedURL: 'https://player.vimeo.com/video/' + videoInfo.id,
                embedHTML: vimeoInfo.embed.html,
                thumbURL: vimeoInfo.pictures.sizes[vimeoInfo.pictures.sizes.length - 1].link,
                postDate: new Date(vimeoInfo.created_time),
                source: 'vimeo',
                pageURL: vimeoInfo.link,
                videoID: videoInfo.id
            };
        }).catch((err) => {
            console.error('error in vimeoinfo pull', err);
            throw err;
        });
    }
}
function wikiImageSearch(title) {
    // Get image info
    return axios({
        method: 'get',
        url: 'https://commons.wikimedia.org/w/api.php?action=query&origin=*&format=json&prop=imageinfo&titles=' + title + '&iiprop=extmetadata%7Curl&iilimit=10&iiurlwidth=250&callback=?',
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then((res) => {
        console.log('res', res);
        const results = res.data;
        console.log('results', results);
        const imageInfo = results.query.pages[Object.keys(results.query.pages)[0]].imageinfo[0];
        console.log(imageInfo);
        return imageInfo;
        // const author = htmlToText.fromString(imageInfo.extmetadata.Artist.value, {
        //   wordwrap: false
        // })
        // let href = ''
        // if (imageInfo.extmetadata.Artist.value.match(/href="([^"]*)/) !== null) {
        //   href = imageInfo.extmetadata.Artist.value.match(/href="([^"]*)/)[1]
        // }
        // return {
        //   title: title,
        //   author: [author],
        //   authorurl: 'https:' + href,
        //   thumbURL: imageInfo.thumburl,
        //   imageURL: imageInfo.url,
        //   postDate: new Date(imageInfo.extmetadata.DateTimeOriginal.value),
        //   credit: imageInfo.extmetadata.Credit.value,
        //   usageTerms: imageInfo.extmetadata.UsageTerms.value,
        //   description: imageInfo.extmetadata.ImageDescription.value,
        //   attributionRequired: imageInfo.extmetadata.AttributionRequired.value,
        //   pageURL: imageInfo.descriptionurl,
        //   source: 'wiki'
        // }
    }).catch((err) => {
        console.log('error in wikiImageSearch', err);
        throw err;
    });
}
function articleExtractor(articleURL) {
    return axios({
        method: 'get',
        url: 'https://mercury.postlight.com/parser?url=' + articleURL,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-api-key': functions.config().mercury.key
        }
    }).then((res) => {
        console.log('response', res.data);
        const data = res.data;
        // console.log(data)
        const text = htmlToText.fromString(data.content);
        console.log('article text', text);
        return {
            title: data.title,
            author: data.author === null ? [] : [data.author],
            postDate: data.date_published === null ? new Date() : new Date(data.date_published),
            domain: data.domain || articleURL,
            description: data.excerpt.replace('&hellip;', '...') || '',
            thumbURL: data.lead_image_url || '',
            pageURL: data.url || articleURL,
            wordCount: data.word_count || 0,
            text: text,
            html: data.content
        };
    }).catch((err) => {
        console.log('something went wrong with the article');
        console.log(err);
        throw err;
    });
}
exports.book = functions.firestore.document('books/{bookid}').onCreate((snap, context) => {
    // console.log(context)
    // console.log(snap)
    // const uid = context.auth.uid
    const bookRef = snap.ref;
    const googleid = snap.data().googleid;
    const url = 'https://www.googleapis.com/books/v1/volumes/' + googleid + '?country=US';
    console.log('url', url);
    return axios({
        method: 'get',
        url: url,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then((res) => {
        console.log('results', res);
        const results = res.data;
        console.log('results', results);
        let isbn = '';
        results.volumeInfo.industryIdentifiers.forEach(function (iden) {
            if (iden.type === 'ISBN_13') {
                isbn = iden.identifier;
            }
        });
        // const book = new Book(bookObj)
        // console.log('book', book)
        return bookRef.set({
            allTags: [],
            author: results.volumeInfo.authors,
            dateAdded: new Date(),
            dateModified: new Date(),
            title: results.volumeInfo.title,
            users: snap.data().users,
            notes: '',
            rating: 0,
            status: 'new',
            tags: [],
            citation: '',
            googleid: results.id,
            isbn: isbn,
            pubYear: results.volumeInfo.publishedDate.split('-')[0],
            publisher: results.volumeInfo.publisher,
            thumbURL: results.volumeInfo.imageLinks.thumbnail
        });
    }).catch((err) => {
        console.log('book error', err);
        return bookRef.update({
            errMessage: err.message
        });
    });
});
exports.movie = functions.firestore.document('movies/{movieid}').onCreate((snap, context) => {
    const movieRef = snap.ref;
    const movieID = snap.data().moviedbid;
    console.log('no error');
    const movieProm = axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + movieID,
        responseType: 'json',
        params: {
            'language': 'en-US',
            'api_key': functions.config().moviedb.key
        }
    });
    const creditProm = axios({
        method: 'get',
        url: 'https://api.themoviedb.org/3/movie/' + movieID + '/credits',
        responseType: 'json',
        params: {
            'language': 'en-US',
            'api_key': functions.config().moviedb.key
        }
    });
    return Promise.all([movieProm, creditProm]).then((res) => {
        const movieData = res[0].data;
        const creditData = res[1].data;
        const director = creditData.crew.filter((person) => {
            return person.job === 'Director';
        });
        return movieRef.set({
            allTags: [],
            author: director.map((person) => {
                return person.name;
            }),
            dateAdded: new Date(),
            dateModified: new Date(),
            title: movieData.title,
            users: snap.data().users,
            notes: '',
            rating: 0,
            status: 'new',
            tags: [],
            citation: '',
            moviedbid: movieID,
            releaseYear: new Date(movieData.release_date).getFullYear(),
            thumbURL: 'https://image.tmdb.org/t/p/w500' + movieData.poster_path
        });
    }).catch((err) => {
        console.error('movie error', err);
        return movieRef.update({
            errMessage: err.message
        });
    });
});
exports.image = functions.firestore.document('images/{imageid}').onCreate((snap, context) => {
    const imageRef = snap.ref;
    switch (snap.data().type) {
        case 'wiki':
            const title = snap.data().title;
            return wikiImageSearch(snap.data().title).then((imageInfo) => {
                const author = htmlToText.fromString(imageInfo.extmetadata.Artist.value, {
                    wordwrap: false
                });
                let href = '';
                if (imageInfo.extmetadata.Artist.value.match(/href="([^"]*)/) !== null) {
                    href = imageInfo.extmetadata.Artist.value.match(/href="([^"]*)/)[1];
                }
                return imageRef.set({
                    allTags: [],
                    dateAdded: new Date(),
                    dateModified: new Date(),
                    users: snap.data().users,
                    notes: '',
                    rating: 0,
                    status: 'new',
                    tags: [],
                    title: title,
                    author: [author],
                    authorurl: 'https:' + href,
                    thumbURL: imageInfo.thumburl,
                    imageURL: imageInfo.url,
                    postDate: new Date(imageInfo.extmetadata.DateTimeOriginal.value),
                    credit: imageInfo.extmetadata.Credit.value,
                    usageTerms: imageInfo.extmetadata.UsageTerms.value,
                    description: imageInfo.extmetadata.ImageDescription.value,
                    attributionRequired: imageInfo.extmetadata.AttributionRequired.value,
                    pageURL: imageInfo.descriptionurl,
                    source: 'wiki'
                });
            }).catch((err) => {
                console.error('wiki image error', err);
                return imageRef.update({
                    errMessage: err.message
                });
            });
        case 'link':
            return imageRef.set({
                allTags: [],
                dateAdded: new Date(),
                dateModified: new Date(),
                users: snap.data().users,
                notes: '',
                rating: 0,
                status: 'new',
                tags: [],
                title: 'linked image',
                author: [],
                authorurl: '',
                thumbURL: snap.data().url,
                imageURL: snap.data().url,
                postDate: new Date(),
                credit: '',
                usageTerms: '',
                description: '',
                attributionRequired: true,
                pageURL: snap.data().url,
                source: 'link'
            });
        case 'upload':
            return imageRef.set({
                allTags: [],
                dateAdded: new Date(),
                dateModified: new Date(),
                users: snap.data().users,
                notes: '',
                rating: 0,
                status: 'new',
                tags: [],
                title: snap.data().title,
                author: [],
                authorurl: '',
                thumbURL: '',
                imageURL: '',
                postDate: new Date(),
                credit: '',
                usageTerms: '',
                description: '',
                attributionRequired: false,
                pageURL: '',
                source: 'upload'
            });
        default:
            console.error('error...incorrect image type');
            return imageRef.update({
                errMessage: 'error...incorrect image type'
            });
    }
});
exports.video = functions.firestore.document('videos/{videoid}').onCreate((snap, context) => {
    const videoRef = snap.ref;
    return videoInfoSearch(snap.data().url).then((res) => {
        const videoObj = Object.assign({}, res);
        videoObj.allTags = [];
        videoObj.dateAdded = new Date();
        videoObj.dateModified = new Date();
        videoObj.users = snap.data().users;
        videoObj.notes = '';
        videoObj.rating = 0;
        videoObj.status = 'new';
        videoObj.tags = [];
        return videoRef.set(videoObj);
    }).catch((err) => {
        console.error('video error', err);
        return videoRef.update({
            errMessage: err.message
        });
    });
});
exports.article = functions.firestore.document('articles/{articleid}').onCreate((snap, context) => {
    const articleRef = snap.ref;
    return articleExtractor(snap.data().url).then((res) => {
        const articleObj = Object.assign({}, res);
        articleObj.allTags = [];
        articleObj.dateAdded = new Date();
        articleObj.dateModified = new Date();
        articleObj.users = snap.data().users;
        articleObj.notes = '';
        articleObj.rating = 0;
        articleObj.status = 'new';
        articleObj.tags = [];
        console.log('article object', articleObj);
        return articleRef.set(articleObj);
    }).catch((err) => {
        console.error('article error', err);
        return articleRef.update({
            errMessage: err.message
        });
    });
});
exports.note = functions.firestore.document('notes/{noteid}').onCreate((snap, context) => {
    const noteRef = snap.ref;
    return noteRef.set({
        allTags: [],
        dateAdded: new Date(),
        dateModified: new Date(),
        users: snap.data().users,
        notes: '',
        rating: 0,
        status: 'new',
        tags: [],
        bibleRefs: [],
        text: '',
        title: snap.data().title
    });
});
exports.document = functions.firestore.document('documents/{documentid}').onCreate((snap, context) => {
    const docRef = snap.ref;
    return docRef.set({
        allTags: [],
        author: [],
        dateAdded: new Date(),
        dateModified: new Date(),
        users: snap.data().users,
        notes: '',
        rating: 0,
        status: 'new',
        tags: [],
        title: snap.data().title,
        citation: '',
        dateProduced: new Date(),
        description: '',
        fileType: snap.data().fileType
    });
});
exports.discourse = functions.firestore.document('discourses/{discourseid}').onCreate((snap, context) => {
    const discourseRef = snap.ref;
    return discourseRef.set({
        allTags: [],
        author: [],
        dateAdded: new Date(),
        dateModified: new Date(),
        users: snap.data().users,
        notes: '',
        rating: 0,
        status: 'new',
        tags: [],
        title: snap.data().title,
        bibleRefs: [],
        citation: '',
        dateOccurred: new Date(),
        eventName: '',
        url: ''
    });
});
exports.composition = functions.firestore.document('compositions/{compositionid}').onCreate((snap, context) => {
    const compositionRef = snap.ref;
    return compositionRef.set({
        allTags: [],
        author: [],
        dateAdded: new Date(),
        dateModified: new Date(),
        users: snap.data().users,
        notes: '',
        rating: 0,
        status: 'new',
        tags: [],
        title: snap.data().title,
        bibleRefs: [],
        citation: '',
        description: '',
        pageURL: '',
        text: '',
        type: snap.data().type,
        url: '',
        wordCount: ''
    });
});
exports.topic = functions.firestore.document('topics/{topicid}').onCreate((snap, context) => {
    const compositionRef = snap.ref;
    return compositionRef.set({
        bibleRefs: [],
        conclusion: '',
        dateAdded: new Date(),
        dateModified: new Date(),
        notes: '',
        premise: '',
        tags: [],
        title: snap.data().title,
        users: snap.data().users
    });
});
//# sourceMappingURL=add.js.map