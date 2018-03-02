<template>
  <q-page padding>
    <div class="row gutter-md items-center">
      <div class="col-xs-12 col-md-4 justify-center">
        <img :src="book.imageURL" width="100%" />
      </div>
      <div class="col-xs-12 col-md-8">
        <h3>{{ book.title }}</h3>
        <div class="row gutter-sm">
          <div class="col-6">
            <q-input v-model="book.author" float-label="Author" dark />
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
            <q-chips-input v-model="tagList" float-label="Tags" dark />
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
            <q-btn color="negative" class="float-right" @click="remove">Delete</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <quote-list :mediaid="id" :media="book" media-type="book"></quote-list>
      </div>
      <div class="col-12">
        <media-notes :user-notes="userNotes" :mediaid="id" media-type="book"></media-notes>
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
      userData: {},
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
      ],
      userTags: {},
      tagList: [],
      userNotes: '',
      booksCollection: this.firebase.books
    }
  },
  watch: {
    tagList: function (userTagList) {
      this.userTags = {}
      userTagList.forEach((tag) => {
        this.userTags[tag] = true
      })
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$binding('book', this.booksCollection.doc(this.id)).then((bookObserve) => {
      }).catch((err) => {
        console.error(err)
      })
      this.$binding('userData', this.booksCollection.doc(this.id).collection('userData').doc(this.firebase.auth.currentUser.uid))
        .then((userObserve) => {
          this.tagList = Object.keys(userObserve.tags)
          this.userNotes = userObserve.notes
        }).catch((err) => {
          console.error(err.message)
          this.booksCollection.doc(this.id).collection('userData').doc(this.firebase.auth.currentUser.uid).set({
            notes: '',
            tags: {}
          })
        })
    },
    update () {
      console.log(this.book)
      this.tagList.forEach((tag) => {
        this.book.allTags[tag] = true
      })
      this.booksCollection.doc(this.id).update({
        author: this.book.author,
        isbn: this.book.isbn,
        status: this.book.status,
        rating: this.book.rating,
        publisher: this.book.publisher,
        pubYear: this.book.pubYear,
        citation: this.book.citation,
        allTags: this.book.allTags
      })
      this.booksCollection.doc(this.id).collection('userData').doc(this.$firebase.auth().currentUser.uid).update({
        tags: this.userTags
      })
      this.$q.notify({
        message: 'Book updated!',
        type: 'positive'
      })
    },
    remove () {
      this.booksCollection.doc(this.id).delete().then(() => {
        this.$router.push('/dashboard')
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
