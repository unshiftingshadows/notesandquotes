const SNIPPET = ['quote', 'idea', 'illustration', 'outline']
const TYPES = [ 'quote', 'outline', 'idea', 'illustration', 'book', 'movie', 'video', 'image', 'composition', 'article', 'document', 'note', 'discourse' ]
const TITLE = [ 'video', 'image', 'composition', 'article', 'document', 'outline' ]
const TEXT = [ 'quote', 'idea', 'illustration' ]

const ALL_TYPES = {
  SNIPPET,
  TYPES,
  TITLE,
  TEXT
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$types = ALL_TYPES
}

export { ALL_TYPES }
