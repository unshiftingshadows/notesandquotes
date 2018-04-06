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
            <!-- <q-list separator link>
              <q-item v-for="result in bookResults" :key="result.id" @click.native="add(result)">
                <q-item-main>
                  <q-item-tile label>{{ result.volumeInfo.title }}</q-item-tile>
                  <q-item-tile sublabel><span v-for="author in result.volumeInfo.authors" :key="author">{{ author }}</span></q-item-tile>
                </q-item-main>
              </q-item>
            </q-list> -->
            <q-card inline v-for="result in bookResults" :key="result.id" @click.native="add(result)" style="cursor: pointer; width: 47%; min-height: 200px; margin: 5px;">
              <q-card-media v-if="result.volumeInfo.imageLinks.thumbnail !== null">
                <img :src="result.volumeInfo.imageLinks.thumbnail" />
                <q-card-title slot="overlay">
                  {{ result.volumeInfo.title }}
                  <span slot="subtitle">{{ result.volumeInfo.authors[0] }}</span>
                </q-card-title>
              </q-card-media>
              <q-card-title v-if="result.volumeInfo.imageLinks.thumbnail === null">
                {{ result.volumeInfo.title }}
                <span slot="subtitle">{{ result.volumeInfo.authors[0] }}</span>
              </q-card-title>
            </q-card>
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
            <q-card inline v-for="result in movieResults" :key="result.id" @click.native="add(result)" style="cursor: pointer; width: 47%; min-height: 200px; margin: 5px;">
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
            <q-btn color="primary" class="float-right" @click.native="add" disable="addDisabled">Add Article</q-btn>
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
            <q-btn color="primary" class="float-right" @click.native="add" disable="addDisabled">Add Image</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'video'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="videoURL" float-label="URL" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="add" disable="addDisabled">Add Video</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'note'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="noteTitle" float-label="Title" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="add" disable="addDisabled">Add Note</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'document'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-btn>Upload</q-btn>
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" disable="addDisabled">Add Document</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'discourse'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="discourseTitle" float-label="Title" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="add" disable="addDisabled">Add Discourse</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'composition'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="compositionTitle" float-label="Title" dark />
          </div>
          <div class="col-12">
            <q-select
              v-model="compositionType"
              float-label="Composition Type"
              :options="compositionSelectOptions"
              dark
            />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="add" disable="addDisabled">Add Composition</q-btn>
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
    addDisabled: false,
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
    documentRef: '',
    discourseTitle: '',
    compositionTitle: '',
    compositionType: 'song',
    compositionSelectOptions: [
      {
        label: 'Song',
        value: 'song'
      },
      {
        label: 'Poem',
        value: 'poem'
      }
    ],
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
      },
      {
        label: 'Document',
        value: 'document'
      },
      {
        label: 'Discourse',
        value: 'discourse'
      },
      {
        label: 'Composition',
        value: 'composition'
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
    add (item) {
      this.addDisabled = true
      var obj = {}
      switch (this.selectType) {
        case 'book':
          obj = {
            googleid: item.id
          }
          break
        case 'movie':
          obj = {
            moviedbid: item.id
          }
          break
        case 'image':
          obj = {
            title: this.imageWikiTitle,
            type: this.imageType,
            url: this.imageURL
          }
          break
        case 'video':
          obj = {
            url: this.videoURL
          }
          break
        case 'article':
          obj = {
            url: this.articleURL
          }
          break
        case 'note':
          obj = {
            title: this.noteTitle
          }
          break
        case 'document':
          obj = {}
          break
        case 'discourse':
          obj = {
            title: this.discourseTitle
          }
          break
        case 'composition':
          obj = {
            title: this.compositionTitle,
            type: this.compositionType
          }
          break
        default:
          console.error('incorrect add type')
      }
      if (obj !== {}) {
        this.database.add(this.selectType, obj, (res) => {
          this.modalFin()
          Notify.create({
            message: this.selectType + ' created!',
            type: 'positive',
            position: 'bottom-left'
          })
          if (this.$route.name === 'topic') {
            console.log('topic page')
            var obj = {
              topic: this.$route.params.id,
              media: res._id,
              type: this.selectType
            }
            console.log(obj)
            this.database.add('resource', obj, (resource) => {
              Notify.create({
                message: 'Added as resource to topic!',
                type: 'positive',
                position: 'bottom-left'
              })
              this.$currentTopic.emit('new-resource', {
                media: res,
                type: this.selectType
              })
            })
          } else {
            this.$router.push({ name: this.selectType, params: { id: res._id } })
          }
        })
      }
    }
  }
}
</script>

<style>
</style>
