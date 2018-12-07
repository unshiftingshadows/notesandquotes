"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const book = {
    allTags: [],
    author: [],
    dateAdded: new Date(),
    dateModified: new Date(),
    title: '',
    users: [],
    // User Data
    notes: '',
    rating: 0,
    status: 'new',
    tags: [],
    citation: '',
    googleid: '',
    isbn: '',
    pubYear: '',
    publisher: '',
    thumbURL: ''
};
class Media {
    // Functions
    constructor(initData) {
        this.dateAdded = new Date();
        this.dateModified = new Date();
        this.title = '';
        // User Data
        this.notes = '';
        this.rating = 0;
        this.status = 'new';
        Object.keys(initData).forEach((index) => {
            this[index] = initData[index];
        });
    }
    toPlainObject() {
        return Object.assign({}, this);
    }
}
class Book extends Media {
    constructor() {
        super(...arguments);
        this.citation = '';
        this.googleid = '';
        this.isbn = '';
        this.pubYear = '';
        this.publisher = '';
        this.thumbURL = '';
    }
}
class Movie extends Media {
    constructor() {
        super(...arguments);
        this.citation = '';
        this.moviedbid = '';
        this.releaseYear = '';
        this.thumbURL = '';
    }
}
class Image extends Media {
    constructor() {
        super(...arguments);
        this.attribution = '';
        this.attributionRequires = true;
        this.authorURL = '';
        this.credit = '';
        this.description = '';
        this.imageURL = '';
        this.pageURL = '';
        this.postDate = new Date();
        this.thumbURL = '';
        this.usageTerms = '';
    }
}
class Video extends Media {
    constructor() {
        super(...arguments);
        this.authorURL = '';
        this.description = '';
        this.duration = 0;
        this.embedHTML = '';
        this.embedURL = '';
        this.pageURL = '';
        this.postDate = new Date();
        this.thumbURL = '';
        this.videoID = '';
    }
}
class Article extends Media {
    constructor() {
        super(...arguments);
        this.citation = '';
        this.description = '';
        this.html = '';
        this.pageURL = '';
        this.postDate = new Date();
        this.thumbURL = '';
        this.text = '';
        this.wordCount = '';
    }
}
class Note {
    constructor() {
        this.dateAdded = new Date();
        this.dateModified = new Date();
        this.text = '';
        this.title = '';
        this.user = '';
    }
}
class Doc extends Media {
    constructor() {
        super(...arguments);
        this.citation = '';
        this.dateProduced = new Date();
        this.description = '';
        this.fileType = '';
    }
}
class Discourse extends Media {
    constructor() {
        super(...arguments);
        this.citation = '';
        this.dateOccurred = new Date();
        this.eventName = '';
        this.url = '';
    }
}
class Composition extends Media {
    constructor() {
        super(...arguments);
        this.citation = '';
        this.description = '';
        this.pageURL = '';
        this.text = '';
        this.url = '';
        this.wordCount = '';
    }
}
exports.MediaClasses = {
    book: book,
    Book: Book,
    Movie: Movie,
    Image: Image,
    Video: Video,
    Article: Article,
    Note: Note,
    Document: Doc,
    Discourse: Discourse,
    Composition: Composition
};
class Snippet {
    constructor() {
        this.dateAdded = new Date();
        this.location = 0;
        this.locationType = 'None';
        this.mediaid = '';
        this.notes = '';
        this.text = '';
        this.user = '';
    }
}
class Quote extends Snippet {
    constructor() {
        super(...arguments);
        this.character = '';
    }
}
class Idea extends Snippet {
    constructor() {
        super(...arguments);
        this.character = '';
    }
}
class Illustration extends Snippet {
    constructor() {
        super(...arguments);
        this.title = '';
    }
}
class Outline extends Snippet {
    constructor() {
        super(...arguments);
        this.numbered = false;
        this.title = '';
    }
}
exports.SnippetClasses = {
    Quote: Quote,
    Idea: Idea,
    Illustration: Illustration,
    Outline: Outline
};
//# sourceMappingURL=types.js.map