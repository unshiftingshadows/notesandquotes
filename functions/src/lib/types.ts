type SnippetMediaTypes = 'book' | 'movie' | 'article' | 'discourse'
type Statuses = 'new' | 'current' | 'viewed' | 'read'
type ImageSources = 'wiki' | 'link' | 'upload'
type VideoSources = 'youtube' | 'vimeo'
type CompositionTypes = 'song' | 'poem'
type QuoteLocations = 'None' | 'Page' | 'Chapter' | 'Kindle' | 'Other'

export type MediaTypes = 'book' | 'movie' | 'image' | 'video' | 'article' | 'note' | 'document' | 'discourse' | 'composition'

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
}

class Media {
  allTags: [String]
  author: [String]
  dateAdded: Date = new Date()
  dateModified: Date = new Date()
  title: String = ''
  users: [String]
  // User Data
  notes: String = ''
  rating: number = 0
  status: Statuses = 'new'
  tags: [String]
  // Functions
  constructor(initData: Object) {
    Object.keys(initData).forEach((index) => {
      this[index] = initData[index]
    })
  }
  toPlainObject() {
    return Object.assign({}, this)
  }
}

class Book extends Media {
  citation: String = ''
  googleid: String = ''
  isbn: String = ''
  pubYear: String = ''
  publisher: String = ''
  thumbURL: String = ''
}

class Movie extends Media {
  citation: String = ''
  moviedbid: String = ''
  releaseYear: String = ''
  thumbURL: String = ''
}

class Image extends Media {
  attribution: String = ''
  attributionRequires: Boolean = true
  authorURL: String = ''
  bibleRefs: [String]
  credit: String = ''
  description: String = ''
  imageURL: String = ''
  pageURL: String = ''
  postDate: Date = new Date()
  source: ImageSources
  thumbURL: String = ''
  usageTerms: String = ''
}

class Video extends Media {
  authorURL: String = ''
  bibleRefs: [String]
  description: String = ''
  duration: number = 0
  embedHTML: String = ''
  embedURL: String = ''
  pageURL: String = ''
  postDate: Date = new Date()
  source: VideoSources
  thumbURL: String = ''
  videoID: String = ''
}

class Article extends Media {
  bibleRefs: [String]
  citation: String = ''
  description: String = ''
  html: String = ''
  pageURL: String = ''
  postDate: Date = new Date()
  thumbURL: String = ''
  text: String = ''
  wordCount: String = ''
}

class Note {
  bibleRefs: [String]
  dateAdded: Date = new Date()
  dateModified: Date = new Date()
  tags: [String]
  text: String = ''
  title: String = ''
  user: String = ''
}

class Doc extends Media {
  citation: String = ''
  dateProduced: Date = new Date()
  description: String = ''
  fileType: String = ''
}

class Discourse extends Media {
  bibleRefs: [String]
  citation: String = ''
  dateOccurred: Date = new Date()
  eventName: String = ''
  url: String = ''
}

class Composition extends Media {
  bibleRefs: [String]
  citation: String = ''
  description: String = ''
  pageURL: String = ''
  text: String = ''
  type: CompositionTypes
  url: String = ''
  wordCount: String = ''
}

export const MediaClasses = {
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
}

class Snippet {
  bibleRefs: [String]
  dateAdded: Date = new Date()
  location: number = 0
  locationType: QuoteLocations = 'None'
  mediaType: SnippetMediaTypes
  mediaid: String = ''
  notes: String = ''
  tags: [String]
  text: String = ''
  user: String = ''
}

class Quote extends Snippet {
  character: String = ''
}

class Idea extends Snippet {
  character: String = ''
}

class Illustration extends Snippet {
  title: String = ''
}

class Outline extends Snippet {
  numbered: Boolean = false
  points: [String]
  title: String = ''
}

export const SnippetClasses = {
  Quote: Quote,
  Idea: Idea,
  Illustration: Illustration,
  Outline: Outline
}