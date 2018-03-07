<template>
  <q-page padding>
    <div class="row gutter-md items-center">
      <div class="col-xs-12 col-md-4 justify-center">
        <img :src="book.thumbURL" width="100%" />
      </div>
      <div class="col-xs-12 col-md-8">
        <h3>{{ book.title }}</h3>
        <div class="row gutter-sm">
          <div class="col-6">
            <!-- <q-input v-model="book.author" float-label="Author" dark /> -->
            <p>{{ book.author }}</p>
          </div>
          <div class="col-6">
            <q-input v-model="book.isbn" float-label="ISBN" dark />
          </div>
          <div class="col-6">
            <q-select v-model="book.status" float-label="Status" radio :options="statusOptions" dark />
          </div>
          <div class="col-6">
            <q-rating v-model="book.rating" :max="5" icon="fa-star" size="1.5em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="userData.tags" float-label="Tags" dark @blur="updateUserData" />
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
        <quote-list :mediaid="id" :media="book" media-type="book"></quote-list>
      </div>
      <div class="col-12">
        <media-notes :user-notes.sync="userData.notes" :update="updateNotes" :mediaid="id" media-type="book"></media-notes>
      </div>
    </div>
  </q-page>
</template>

<script>
import QuoteList from 'components/QuoteList.vue'
import MediaNotes from 'components/MediaNotes'

export default {
  components: {
    QuoteList,
    MediaNotes
  },
  data () {
    return {
      id: this.$route.params.id,
      book: {},
      userData: {
        tags: [],
        notes: ''
      },
      statusOptions: [
        {
          label: 'To Read',
          value: 'toread'
        },
        {
          label: 'Current',
          value: 'current'
        },
        {
          label: 'Read',
          value: 'read'
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.database.view('book', this.id, (resource, userData) => {
        this.book = resource
        this.userData = userData
      })
    },
    updateNotes (notes) {
      this.userData.notes = notes
      this.updateUserData()
    },
    updateUserData () {
      var userData = {
        notes: this.userData.notes,
        tags: this.userData.tags
      }
      this.database.update(this.id, 'book', userData, { updateUserData: true }, (res) => {
        console.log(res)
      })
    },
    update () {
      console.log('update', this.book)
      var resource = {
        isbn: this.book.isbn,
        status: this.book.status,
        rating: this.book.rating,
        publisher: this.book.publisher,
        pubYear: this.book.pubYear,
        citation: this.book.citation,
        allTags: this.book.allTags
      }
      this.database.update(this.id, 'book', resource, { updateUserData: false }, (res) => {
        console.log(res)
      })
    },
    remove () {
      console.log('remove')
      this.database.remove(this.id, 'book', (res) => {
        console.log(res)
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
