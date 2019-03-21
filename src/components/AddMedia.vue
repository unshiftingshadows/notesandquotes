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
            <q-input v-model="bookSearch" :loading="bookResultsLoading" @keyup.enter="googleBookSearch" float-label="Search Books" dark :after="[{ icon: 'fas fa-arrow-right', handler: googleBookSearch }]" />
          </div>
          <div class="col-12" v-if="!bookResultsLoading">
            <q-card inline v-for="result in bookResults" :key="result.id" @click.native="add(result)" style="cursor: pointer; width: 47%; min-height: 200px; margin: 5px;">
              <q-card-media v-if="result.volumeInfo.imageLinks !== undefined && result.volumeInfo.imageLinks.thumbnail !== null">
                <img :src="result.volumeInfo.imageLinks.thumbnail" />
                <q-card-title slot="overlay">
                  {{ result.volumeInfo.title }}
                  <span slot="subtitle" v-if="result.volumeInfo.authors">{{ result.volumeInfo.authors[0] }}</span>
                </q-card-title>
              </q-card-media>
              <q-card-title v-if="result.volumeInfo.imageLinks === undefined || result.volumeInfo.imageLinks.thumbnail === null">
                {{ result.volumeInfo.title }}
                <span slot="subtitle" v-if="result.volumeInfo.authors">{{ result.volumeInfo.authors[0] }}</span>
              </q-card-title>
            </q-card>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'movie'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="movieSearch" :loading="movieResultsLoading" @keyup.enter="moviedbSearch" float-label="Search Movies" dark :after="[{ icon: 'fas fa-arrow-right', handler: moviedbSearch }]" />
          </div>
          <div class="col-12">
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
            <q-btn color="primary" class="float-right" @click.native="add" :disable="addDisabled">Add Article</q-btn>
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
          <div class="col-12" v-if="imageType === 'wiki'">
            <q-input v-model="imageWikiTitle"  float-label="Wiki Title" dark />
          </div>
          <div class="col-12" v-if="imageType === 'link'">
            <q-input v-model="imageURL" float-label="URL" dark />
          </div>
          <div class="col-12" v-if="imageType === 'upload'">
            <FilePond
              name="imageupload"
              ref="imageupload"
              labelIdle="Drop images here..."
              allowMultiple="false"
              :acceptedFileTypes="['image/jpeg', 'image/png', 'image/gif', 'image/tiff']"
              :files="images"
              @init="handleImageServerInit"
              @addfilestart="addImageFile"
            />
          </div>
          <div class="col-12" v-if="imageType !== 'upload'">
            <q-btn color="primary" class="float-right" @click.native="add" :disable="addDisabled">Add Image</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'video'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="videoURL" float-label="URL" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="add" :disable="addDisabled">Add Video</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'note'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="noteTitle" float-label="Title" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="add" :disable="addDisabled">Add Note</q-btn>
          </div>
        </div>
      </div>
      <div v-if="selectType === 'document'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <FilePond
              name="documentupload"
              ref="documentupload"
              label-idle="Drop documents here..."
              allow-multiple="false"
              :accepted-file-types="[
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                /**'application/xml',
                'text/html',
                'text/csv',
                'application/epub+zip',
                'application/json',
                'application/rtf',
                'text/plain',**/
                'application/pdf'
              ]"
              @init="handleDocumentServerInit"
              :files="documents"
              @addfilestart="addDocumentFile"
            />
          </div>
        </div>
      </div>
      <div v-if="selectType === 'discourse'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="discourseTitle" float-label="Title" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="add" :disable="addDisabled">Add Discourse</q-btn>
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
            <q-btn color="primary" class="float-right" @click.native="add" :disable="addDisabled">Add Composition</q-btn>
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
import vueFilePond from 'vue-filepond'
import FilePondImagePreview from 'filepond-plugin-image-preview'
import FilePondValidateType from 'filepond-plugin-file-validate-type'

const FilePond = vueFilePond(FilePondImagePreview, FilePondValidateType)

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

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
        label: 'Upload',
        value: 'upload'
      }
    ],
    imageWikiTitle: '',
    imageURL: '',
    images: [],
    noteTitle: '',
    documents: [],
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
  components: {
    FilePond
  },
  props: ['modalFin'],
  data () {
    return initialState()
  },
  methods: {
    reset () {
      console.log('reset')
      Object.assign(this.$data, initialState())
    },
    async googleBookSearch () {
      this.bookResultsLoading = true
      // this.database.lookup(this.bookSearch, 'book', (res) => {
      //   this.bookResults = res.items
      // })
      const res = await this.$firebase.lookup(this.bookSearch, 'book')
      console.log(res)
      this.bookResults = res.items
      this.bookResultsLoading = false
    },
    async moviedbSearch () {
      this.movieResultsLoading = true
      // this.database.lookup(this.movieSearch, 'movie', (res) => {
      //   console.log(res)
      //   this.movieResults = res.results
      // })
      const res = await this.$firebase.lookup(this.movieSearch, 'movie')
      console.log(res)
      this.movieResults = res.results
      this.movieResultsLoading = false
    },
    handleImageServerInit () {
      console.log('filepond has initialized', this.$refs)
    },
    addImageFile () {
      console.log('process started!')

      const { file } = this.$refs.imageupload.getFiles()[0]

      this.$firebase.list('image').add({ title: file.name, type: 'upload', users: [ this.$firebase.auth.currentUser.uid ] }).then((res) => {
        console.log('database image added')
        var uploadProcess = this.$firebase.imagesRef.child(res.id).put(file)
        uploadProcess.on('state_changed', (snapshot) => {
          // progress(true, snapshot.bytesTransferred, snapshot.totalBytes)
        }, (err) => {
          console.error(err)
          // abortProcessing()
        }, () => {
          // load(uploadProcess.snapshot.ref.name)
          this.modalFin()
          this.$router.push({ name: this.selectType, params: { id: res.id } })
          // })
        })
      })
    },
    handleDocumentServerInit () {
      console.log('filepond documents has initialized', this.$refs)
    },
    addDocumentFile () {
      console.log('process started!')

      const { file } = this.$refs.documentupload.getFiles()[0]

      this.$firebase.list('document').add({ title: file.name, fileType: file.type, users: [ this.$firebase.auth.currentUser.uid ] }).then((res) => {
        console.log('database document added')
        var uploadProcess = this.$firebase.documentsRef.child(res.id).put(file)
        uploadProcess.on('state_changed', (snapshot) => {
          // progress(true, snapshot.bytesTransferred, snapshot.totalBytes)
        }, (err) => {
          console.error(err)
          // abortProcessing()
        }, () => {
          // load(uploadProcess.snapshot.ref.name)
          this.modalFin()
          this.$router.push({ name: this.selectType, params: { id: res.id } })
          // })
        })
      })
    },
    add (item) {
      this.addDisabled = true
      var obj = {
        users: [ this.$firebase.auth.currentUser.uid ]
      }
      switch (this.selectType) {
        case 'book':
          obj.googleid = item.id
          break
        case 'movie':
          obj.moviedbid = item.id
          break
        case 'image':
          obj.title = this.imageWikiTitle
          obj.type = this.imageType
          obj.url = this.imageURL
          break
        case 'video':
          obj.url = this.videoURL
          break
        case 'article':
          obj.url = this.articleURL
          break
        case 'note':
          obj.title = this.noteTitle
          break
        case 'document':
          break
        case 'discourse':
          obj.title = this.discourseTitle
          break
        case 'composition':
          obj.title = this.compositionTitle
          obj.type = this.compositionType
          break
        default:
          console.error('incorrect add type')
      }
      if (obj !== {}) {
        // this.database.add(this.selectType, obj, (res) => {
        //   this.modalFin()
        //   Notify.create({
        //     message: this.selectType + ' created!',
        //     type: 'positive',
        //     position: 'bottom-left'
        //   })
        //   if (this.$route.name === 'topic') {
        //     console.log('topic page')
        //     var obj = {
        //       topic: this.$route.params.id,
        //       media: res._id,
        //       type: this.selectType
        //     }
        //     console.log(obj)
        //     this.database.add('resource', obj, (resource) => {
        //       Notify.create({
        //         message: 'Added as resource to topic!',
        //         type: 'positive',
        //         position: 'bottom-left'
        //       })
        //       this.$currentTopic.emit('new-resource', {
        //         media: res,
        //         type: this.selectType
        //       })
        //     })
        //   } else {
        //     this.$router.push({ name: this.selectType, params: { id: res._id } })
        //   }
        // })
        console.log('new obj', obj)
        this.$firebase.list(this.selectType).add(obj).then((res) => {
          this.modalFin()
          Notify.create({
            message: this.selectType + ' created!',
            type: 'positive',
            position: 'bottom-left'
          })
          if (this.$route.name === 'topic') {
            console.log('topic page')
            var obj = {
              id: res.id,
              type: this.selectType,
              dateAdded: new Date(),
              addedBy: this.$firebase.auth.currentUser.uid
            }
            console.log(obj)
            this.$firebase.view('topic', this.$route.params.id).collection('resources').add(obj).then((resource) => {
              Notify.create({
                message: 'Added as resource to topic!',
                type: 'positive',
                position: 'bottom-left'
              })
              // this.$currentTopic.emit('new-resource', {
              //   media: res,
              //   type: this.selectType
              // })
            })
          } else {
            this.$router.push({ name: this.selectType, params: { id: res.id } })
          }
          this.reset()
        })
      }
    }
  }
}
</script>

<style>
</style>
