<template>
  <q-page padding>
    <div class="row gutter-md items-center">
      <div class="col-xs-12 justify-center">
        <img :src="image.imageURL" class="responsive" />
      </div>
      <div class="col-xs-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <h3>{{ image.title }} <a :href="image.pageURL" target="_blank"><q-icon name="fa-link" /></a></h3>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="image.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
          </div>
          <div class="col-6">
            <q-input v-model="image.author" float-label="Author" dark></q-input>
          </div>
          <div class="col-6">
            <q-rating v-model="userData.rating" :max="5" icon="fa-star" size="1.5em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="userData.tags" float-label="Tags" dark />
          </div>
          <div class="col-12" v-if="image.attributionRequired">
            <h5>Attribution Required</h5>
            <q-input v-model="image.attribution" type="textarea" :max-height="100" :min-rows="2" float-label="Attribution" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click="update">Update</q-btn>
            <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <media-notes :user-notes="userData.notes" :update="updateNotes" :mediaid="id" media-type="image"></media-notes>
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
      image: {},
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
          label: 'Viewed',
          value: 'viewed'
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.database.view('image', this.id, (resource, userData) => {
        this.image = resource
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
      this.database.update(this.id, 'image', userData, { updateUserData: true }, (res) => {
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
      this.database.update(this.id, 'image', resource, { updateUserData: false }, (res) => {
        Notify.create({
          message: 'Image updated!',
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
      return this.$selectedTopic.get() && !this.$selectedTopic.find(this.image._id)
    },
    topicAdd () {
      var obj = {
        topic: this.$selectedTopic.get().id,
        media: this.image._id,
        type: 'image'
      }
      this.database.add('resource', obj, (res) => {
        this.$selectedTopic.add(this.image._id)
      })
    }
  }
}
</script>

<style>
</style>
