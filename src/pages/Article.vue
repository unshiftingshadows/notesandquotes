<template>
  <q-page padding>
    <div class="row gutter-md justify-center">
      <div class="col-xs-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <h3>{{ article.title }} <a :href="article.url" target="_blank"><q-icon name="fa-link" /></a></h3>
      </div>
      <div class="col-xs-12 col-md-10">
        <div class="article-content">
          <span v-html="article.html"></span>
        </div>
      </div>
      <div class="row gutter-sm">
        <div class="col-12">
          <q-input v-model="article.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
        </div>
        <div class="col-6">
          <q-chips-input v-model="article.author" float-label="Author" dark />
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
      article: {
        author: []
      },
      userData: {
        tags: [],
        notes: '',
        rating: 0,
        status: 'new'
      },
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
    },
    showTopicAdd () {
      return this.$selectedTopic.get() && !this.$selectedTopic.find(this.article._id)
    },
    topicAdd () {
      var obj = {
        topic: this.$selectedTopic.get().id,
        media: this.article._id,
        type: 'article'
      }
      this.database.add('resource', obj, (res) => {
        this.$selectedTopic.add(this.article._id)
      })
    }
  }
}
</script>

<style>
</style>
