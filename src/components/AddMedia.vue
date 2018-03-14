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
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="movieSearch" :loading="movieResultsLoading" @keyup.enter="moviedbSearch" float-label="Search Movies" dark />
          </div>
          <div class="col-12">
            <!-- <q-list separator link>
              <q-item v-for="result in movieResults" :key="result.id" @click.native="addMovie(result)">
                <q-item-main>
                  <q-item-tile label>{{ result.title }}</q-item-tile>
                  <q-item-tile sublabel><span v-for="author in result.volumeInfo.authors" :key="author">{{ author }}</span></q-item-tile>
                </q-item-main>
              </q-item>
            </q-list> -->
            <q-card inline v-for="result in movieResults" :key="result.id" @click.native="addMovie(result)" style="cursor: pointer; width: 47%; min-height: 200px; margin: 5px;">
              <q-card-media v-if="result.poster_path !== null">
                <img :src="'https://image.tmdb.org/t/p/w500' + result.poster_path" />
                <q-card-title slot="overlay">
                  {{ result.title }}
                </q-card-title>
              </q-card-media>
              <q-card-title v-if="result.poster_path === null">
                {{ result.title }}
              </q-card-title>
            </q-card>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'article'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="articleURL" float-label="URL" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="addArticle">Add Article</q-btn>
          </div>
        </div>
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
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="videoURL" float-label="URL" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="addVideo">Add Video</q-btn>
          </div>
        </div>
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
    movieSearch: '',
    movieResultsLoading: false,
    movieResults: [],
    articleURL: '',
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
    moviedbSearch () {
      this.database.lookup(this.movieSearch, 'movie', (res) => {
        console.log(res)
        this.movieResults = res.results
      })
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
    addMovie (movie) {
      console.log('add movie')
      var movieObj = {
        moviedbid: movie.id
      }
      console.log(movieObj)
      this.database.add('movie', movieObj, (res) => {
        this.modalFin()
        Notify.create({
          message: 'Movie created!',
          type: 'positive',
          position: 'bottom-left'
        })
        this.$router.push({ name: 'movie', params: { id: res._id } })
      })
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
      }
      console.log(videoObj)
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
        url: this.articleURL
      }
      console.log(articleObj)
      this.database.add('article', articleObj, (res) => {
        this.modalFin()
        Notify.create({
          message: 'Article created!',
          type: 'positive',
          position: 'bottom-left'
        })
        this.$router.push({ name: 'article', params: { id: res._id } })
      })
    },
    addNote () {
      console.log('add note')
      var noteObj = {
        title: this.noteTitle
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
    }
  }
}
</script>

<style>
</style>
