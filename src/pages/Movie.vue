<template>
  <q-page padding>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="col-xs-12 col-md-4 justify-center">
        <img :src="movie.thumbURL" width="100%" />
      </div>
      <div class="col-xs-12 col-md-8">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <h3>{{ movie.title }}</h3>
        <div class="row gutter-sm">
          <div class="col-6">
            <q-chips-input v-model="movie.author" float-label="Author" dark add-icon="fas fa-plus" />
          </div>
          <div class="col-6">
            <q-select v-model="movie.status" float-label="Status" radio :options="statusOptions" dark />
          </div>
          <div class="col-6">
            <q-rating v-model="movie.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="movie.tags" float-label="Tags" dark @blur="update" />
          </div>
          <div class="col-6">
            <q-input v-model="movie.releaseYear" float-label="Release Year" dark />
          </div>
          <div class="col-12">
            <q-input v-model="movie.citation" float-label="Citation" type="textarea" :max-height="100" :min-rows="2" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click="update">Update</q-btn>
            <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <quote-list :mediaid="id" :media="movie" media-type="movie"></quote-list>
      </div>
      <div class="col-12">
        <media-notes :user-notes.sync="movie.notes" :update="updateNotes" :mediaid="id" media-type="movie"></media-notes>
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
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      movie: this.$fiery(this.$firebase.view('movie', this.$route.params.id), {
        onSuccess: () => {
          this.loading = false
        }
      }),
      // userData: {
      //   tags: [],
      //   notes: '',
      //   rating: 0,
      //   status: 'new'
      // },
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
      ]
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      // this.database.view('movie', this.id, (resource, userData) => {
      //   this.movie = resource
      //   this.userData = userData
      // })
    },
    updateNotes (notes) {
      this.movie.notes = notes
      this.update()
    },
    // updateUserData () {
    //   var userData = {
    //     notes: this.userData.notes,
    //     tags: this.userData.tags,
    //     rating: this.userData.rating,
    //     status: this.userData.status
    //   }
    //   this.database.update(this.id, 'movie', userData, { updateUserData: true }, (res) => {
    //     Notify.create({
    //       message: 'User data updated!',
    //       type: 'positive',
    //       position: 'bottom-left'
    //     })
    //   })
    // },
    update () {
      console.log('update', this.movie)
      this.$fiery.update(this.movie).then(() => {
        Notify.create({
          message: 'Movie updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var resource = {
      //   isbn: this.movie.isbn,
      //   publisher: this.movie.publisher,
      //   pubYear: this.movie.pubYear,
      //   citation: this.movie.citation
      // }
      // this.database.update(this.id, 'movie', resource, { updateUserData: false }, (res) => {
      //   Notify.create({
      //     message: 'Movie updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
      // this.updateUserData()
    },
    remove () {
      console.log('Remove not implemented...')
    },
    showTopicAdd () {
      return this.$selectedTopic.get() && !this.$selectedTopic.find(this.movie._id)
    },
    topicAdd () {
      var obj = {
        topic: this.$selectedTopic.get().id,
        media: this.movie._id,
        type: 'movie'
      }
      this.database.add('resource', obj, (res) => {
        this.$selectedTopic.add(this.movie._id)
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
