<template>
  <div>
    <h4>Add Media</h4>
    <div class="row gutter-sm">
      <div class="col-12">
        <q-select
          v-model="selectType"
          float-label="Media Type"
          :options="selectOptions"
          dark
        />
      </div>
      <div v-if="selectType === 'book'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="bookSearch" :loading="bookResultsLoading" @keyup.enter="googleBookSearch" float-label="Search Books" dark />
          </div>
          <div class="col-12">
            <q-list separator link>
              <q-item v-for="result in bookResults" :key="result.id" @click.native="addBook(result)">
                <q-item-main>
                  <q-item-tile label>{{ result.volumeInfo.title }}</q-item-tile>
                  <q-item-tile sublabel><span v-for="author in result.volumeInfo.authors" :key="author">{{ author }}</span></q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'movie'" class="col-12">
        <q-input v-model="movieTitle" float-label="Title" dark />
        <q-input v-model="movieDirector" float-label="Director" dark />
        <q-input v-model="movieYear" float-label="Year" dark />
        <q-btn color="primary" class="float-right" @click.native="addMovie">Add Movie</q-btn>
      </div>
      <div v-if="selectType === 'article'" class="col-12">
        <q-input v-model="articleTitle" float-label="Title" dark />
        <q-input v-model="articleAuthor" float-label="Author" dark />
        <q-input v-model="articleURL" float-label="URL" dark />
        <q-btn color="primary" class="float-right" @click.native="addArticle">Add Article</q-btn>
      </div>
      <div v-if="selectType === 'image'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-select
              v-model="imageType"
              float-label="Image Type"
              :options="imageSelectOptions"
              dark
            />
          </div>
          <div class="col-12">
            <q-input v-model="imageWikiTitle" v-if="imageType === 'wiki'" float-label="Wiki Title" dark />
          </div>
          <div class="col-12">
            <q-input v-model="imageURL" v-if="imageType ==='link'" float-label="URL" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="addImage">Add Image</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'video'" class="col-12">
        <q-input v-model="videoURL" float-label="URL" dark />
        <q-btn color="primary" class="float-right" @click.native="addVideo">Add Video</q-btn>
      </div>
      <div v-if="selectType === 'note'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="noteTitle" float-label="Title" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="addNote">Add Note</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'
// import * as getVideoId from 'get-video-id'
// import * as unfluff from 'unfluff'
// NOTE: Could use unfluff to generate tags

function initialState () {
  return {
    bookResults: [],
    bookResultsLoading: false,
    bookSearch: '',
    movieTitle: '',
    movieDirector: '',
    movieYear: '',
    articleTitle: '',
    articleAuthor: '',
    articleURL: '',
    articleText: '',
    videoURL: '',
    imageType: 'wiki',
    imageSelectOptions: [
      {
        label: 'Wiki',
        value: 'wiki'
      },
      {
        label: 'Link',
        value: 'link'
      },
      {
        label: 'Storage',
        value: 'storage'
      }
    ],
    imageWikiTitle: '',
    imageURL: '',
    noteTitle: '',
    researchTitle: '',
    selectType: '',
    selectOptions: [
      {
        label: 'Book',
        value: 'book'
      },
      {
        label: 'Movie',
        value: 'movie'
      },
      {
        label: 'Article',
        value: 'article'
      },
      {
        label: 'Image',
        value: 'image'
      },
      {
        label: 'Video',
        value: 'video'
      },
      {
        label: 'Note',
        value: 'note'
      }
    ]
  }
}

export default {
  props: ['modalFin'],
  data () {
    return initialState()
  },
  methods: {
    reset () {
      console.log('reset')
      Object.assign(this.$data, initialState())
    },
    googleBookSearch () {
      this.database.lookup(this.bookSearch, 'book', (res) => {
        this.bookResults = res.items
      })
    },
    movieSearch () {
      // TODO: After
    },
    addBook (book) {
      var bookObj = {
        googleid: book.id
      }
      console.log(bookObj)
      this.database.add('book', bookObj, (res) => {
        this.modalFin()
        Notify.create({
          message: 'Book created!',
          type: 'positive',
          position: 'bottom-left'
        })
        this.$router.push({ name: 'book', params: { id: res._id } })
      })
    },
    addMovie () {
      console.log('add movie')
    },
    addImage () {
      console.log('add image')
      var imageObj = {
        title: this.imageWikiTitle,
        type: this.imageType,
        url: this.imageURL
      }
      console.log(imageObj)
      this.database.add('image', imageObj, (res) => {
        this.modalFin()
        Notify.create({
          message: 'Image created!',
          type: 'positive',
          position: 'bottom-left'
        })
        this.$router.push({ name: 'image', params: { id: res._id } })
      })
    },
    addVideo () {
      console.log('add video')
      var videoObj = {
        url: this.videoURL
        // title: video.title,
        // author: video.author,
        // authorurl: video.authorurl,
        // description: video.description,
        // duration: video.duration,
        // embedurl: 'https://www.youtube.com/embed/' + video.videoID,
        // embedhtml: video.embedHtml,
        // imageURL: video.imageURL,
        // postDate: video.postDate,
        // provider: video.provider,
        // rating: 0,
        // status: 'new',
        // url: video.url,
        // videoID: video.videoID,
        // allTags: {},
        // allBibleRefs: [],
        // dateAdded: new Date(),
        // dateModified: new Date()
      }
      console.log(videoObj)
      // Firebase.videosCollection.add(videoObj).then((docRef) => {
      //   // console.log(docRef.id)
      //   this.modalFin()
      //   this.$router.push({ name: 'video', params: { id: docRef.id } })
      //   return true
      // })
      this.database.add('video', videoObj, (res) => {
        this.modalFin()
        Notify.create({
          message: 'Video created!',
          type: 'positive',
          position: 'bottom-left'
        })
        this.$router.push({ name: 'video', params: { id: res._id } })
      })
    },
    addArticle () {
      console.log('add article')
      var articleObj = {
        // title: article.title || this.articleTitle,
        // author: article.author || this.articleAuthor,
        // domain: article.domain,
        // text: article.text,
        // postDate: article.postDate,
        // description: article.description,
        // url: article.url,
        // imageURL: article.imageURL,
        // wordCount: article.wordCount,
        // html: article.html,
        // rating: 0,
        // status: 'new',
        // allTags: {},
        // allBibleRefs: [],
        // dateAdded: new Date(),
        // dateModified: new Date()
      }
      console.log(articleObj)
      // Firebase.articlesCollection.add(articleObj).then((docRef) => {
      //   this.modalFin()
      //   this.$router.push({ name: 'article', params: { id: docRef.id } })
      //   return true
      // })
    },
    addNote () {
      console.log('add note')
      var noteObj = {
        title: this.noteTitle
        // tags: {},
        // bibleRef: [],
        // text: '',
        // dateAdded: new Date(),
        // dateModified: new Date()
      }
      console.log(noteObj)
      this.database.add('note', noteObj, (res) => {
        this.modalFin()
        Notify.create({
          message: 'Note created!',
          type: 'positive',
          position: 'bottom-left'
        })
        this.$router.push({ name: 'note', params: { id: res._id } })
      })
      // Firebase.notesCollection.add(noteObj).then((docRef) => {
      //   // console.log(docRef.id)
      //   this.modalFin()
      //   this.$router.push({ name: 'note', params: { id: docRef.id } })
      //   return true
      // })
    }
  }
}
</script>

<style>
</style>
