<template>
  <q-page padding>
    <div class="row md-gutter justify-center">
      <div class="col-xs-12">
        <h1>{{ article.title }} <a :href="article.url" target="_blank"><q-icon name="fa-link" /></a></h1>
      </div>
      <div class="col-xs-12 col-md-10">
        <div class="article-content">
          <span v-html="article.html"></span>
        </div>
      </div>
      <div class="row sm-gutter">
        <div class="col-12">
          <q-input v-model="article.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
        </div>
        <div class="col-6">
          <q-input v-model="article.author" float-label="Author" dark></q-input>
        </div>
        <div class="col-6">
          <q-select v-model="userData.status" float-label="Status" radio :options="statusOptions" dark />
        </div>
        <div class="col-6">
          <q-rating v-model="userData.rating" :max="5" icon="fa-star" size="1.5em" style="padding-top: 15px; padding-left: 20px" dark />
        </div>
        <div class="col-12">
          <q-chips-input v-model="userData.tags" float-label="Tags" dark />
        </div>
        <div class="col-12">
          <q-btn color="primary" @click="update">Update</q-btn>
          <q-btn color="negative" class="float-right" @click="remove">Delete</q-btn>
        </div>
      </div>
      <div class="col-12">
        <media-notes :user-notes="userData.notes" :update="updateNotes" :mediaid="id" media-type="article"></media-notes>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import MediaNotes from 'components/MediaNotes.vue'

export default {
  components: {
    MediaNotes
  },
  data () {
    return {
      id: this.$route.params.id,
      article: {},
      userData: {},
      statusOptions: [
        {
          label: 'New',
          value: 'new'
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
      this.database.view('article', this.id, (resource, userData) => {
        this.article = resource
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
        tags: this.userData.tags,
        rating: this.userData.rating,
        status: this.userData.status
      }
      this.database.update(this.id, 'article', userData, { updateUserData: true }, (res) => {
        Notify.create({
          message: 'User data updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
    },
    update () {
      var resource = {
        description: this.image.description,
        author: this.image.author
      }
      this.database.update(this.id, 'article', resource, { updateUserData: false }, (res) => {
        Notify.create({
          message: 'Article updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      this.updateUserData()
    },
    remove () {
      console.log('remove not implemented...')
    }
  }
}
</script>

<style>
</style>
