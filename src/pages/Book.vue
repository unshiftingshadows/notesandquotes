<template>
  <q-page padding>
    <q-spinner color="primary" class="absolute-center" size="3rem" v-if="loading && !book.errMessage" />
    <h3 v-if="book.errMessage">Sorry...but there was an error...</h3>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="gt-sm col-md-4 justify-center">
        <img :src="largeImageURL" width="100%" />
      </div>
      <div class="col-xs-12 col-md-8">
        <div class="row gutter-sm">
          <div class="col-xs-4 lt-md justify-center">
            <img :src="book.thumbURL" width="100%" />
          </div>
          <div class="col-xs-8 col-md-12">
            <span class="float-right" v-if="this.$selectedTopic.get()">
              <q-btn label="Added!" icon="fas fa-check" disable color="positive" v-if="addState === 'y'" />
              <q-btn label="Add" icon="fas fa-plus" disable v-if="addState === 'd'" />
              <q-btn label="Add" icon="fas fa-plus" @click.native="topicAdd" v-if="addState === 'n'" />
            </span>
            <h3>{{ book.title }}</h3>
          </div>
          <div class="col-xs-12 col-md-6">
            <q-chips-input v-model="book.author" float-label="Author" dark add-icon="fas fa-plus" />
          </div>
          <div class="col-xs-12 col-md-6">
            <q-input v-model="book.isbn" float-label="ISBN" dark />
          </div>
          <div class="col-6">
            <q-select v-model="book.status" float-label="Status" radio :options="statusOptions" dark />
          </div>
          <div class="col-6">
            <q-rating v-model="book.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="book.tags" float-label="Tags" dark @blur="update" />
          </div>
          <div class="col-6">
            <q-input v-model="book.publisher" float-label="Publisher" dark />
          </div>
          <div class="col-6">
            <q-input v-model="book.pubYear" float-label="Publication Year" dark />
          </div>
          <div class="col-12">
            <q-input v-model="book.citation" float-label="Citation" type="textarea" :max-height="100" :min-rows="2" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click="update">Update</q-btn>
            <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <quote-list :mediaid="id" :media="book" media-type="book" />
      </div>
      <div class="col-12">
        <media-notes :user-notes.sync="book.notes" :update="updateNotes" :mediaid="id" media-type="book"></media-notes>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import QuoteList from 'components/QuoteList.vue'
import MediaNotes from 'components/MediaNotes'

export default {
  components: {
    QuoteList,
    MediaNotes
  },
  name: 'Book',
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      book: this.$fiery(this.$firebase.view('book', this.$route.params.id), {
        onSuccess: () => {
          if (this.book.status) {
            if (this.book.thumbURL.startsWith('http://books.google.com/') || this.book.thumbURL.startsWith('https://books.google.com/')) {
              this.largeImageURL = this.book.thumbURL.slice(0, this.book.thumbURL.indexOf('&zoom'))
            } else {
              this.largeImageURL = this.book.thumbURL
            }
            this.loading = false
          } else {
            this.loading = true
          }
        }
      }),
      // userData: {
      //   tags: [],
      //   notes: '',
      //   rating: 0,
      //   status: 'new'
      // },
      largeImageURL: '',
      statusOptions: [
        {
          label: 'New',
          value: 'new'
        },
        {
          label: 'Current',
          value: 'current'
        },
        {
          label: 'Read',
          value: 'read'
        }
      ],
      addState: this.$selectedTopic.get() && !this.$selectedTopic.find(this.$route.params.id) ? 'n' : 'y'
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      // this.database.view('book', this.id, (resource, userData) => {
      //   this.book = resource
      //   this.userData = userData
      //   if (this.book.thumbURL.startsWith('http://books.google.com/') || this.book.thumbURL.startsWith('https://books.google.com/')) {
      //     this.largeImageURL = this.book.thumbURL.slice(0, this.book.thumbURL.indexOf('&zoom'))
      //   } else {
      //     this.largeImageURL = this.book.thumbURL
      //   }
      // })
    },
    updateNotes (notes) {
      this.book.notes = notes
      this.update()
    },
    // updateUserData () {
    //   var userData = {
    //     notes: this.userData.notes,
    //     tags: this.userData.tags,
    //     rating: this.userData.rating,
    //     status: this.userData.status
    //   }
    //   // this.database.update(this.id, 'book', userData, { updateUserData: true }, (res) => {
    //   //   Notify.create({
    //   //     message: 'User data updated!',
    //   //     type: 'positive',
    //   //     position: 'bottom-left'
    //   //   })
    //   // })
    // },
    update () {
      console.log('update', this.book)
      this.$fiery.update(this.book).then(() => {
        Notify.create({
          message: 'Book updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var resource = {
      //   isbn: this.book.isbn,
      //   publisher: this.book.publisher,
      //   pubYear: this.book.pubYear,
      //   citation: this.book.citation
      // }
      // this.database.update(this.id, 'book', resource, { updateUserData: false }, (res) => {
      //   Notify.create({
      //     message: 'Book updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
      // this.updateUserData()
    },
    remove () {
      console.log('Remove not implemented...')
    },
    topicAdd () {
      this.addState = 'd'
      var obj = {
        id: this.id,
        type: 'book'
      }
      this.$selectedTopic.add(obj).then((ans) => {
        this.addState = ans ? 'y' : 'n'
      })
    }
  }
}
</script>

<style>

@media screen and (min-width: 1200px) {
  .media-page {
    margin: 0 auto;
    max-width: 1000px;
  }
}

</style>
