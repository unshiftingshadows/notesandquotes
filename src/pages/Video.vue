<template>
  <q-page padding>
    <div class="row gutter-md items-center">
      <div class="col-xs-12 justify-center">
        <q-video :src="video.embedURL" />
      </div>
      <div class="col-xs-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <h3>{{ video.title }}</h3>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="video.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
          </div>
          <div class="col-6">
            <q-chips-input v-model="video.author" float-label="Author" dark add-icon="fas fa-plus" />
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
            <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <media-notes :user-notes="userData.notes" :update="updateNotes" :mediaid="id" media-type="video"></media-notes>
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
      video: {
        embedURL: ''
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
          label: 'Watched',
          value: 'watched'
        }
      ]
    }
  },
  mounted () {
    console.log(this.$selectedTopic.get())
    this.init()
  },
  methods: {
    init () {
      this.database.view('video', this.id, (resource, userData) => {
        this.video = resource
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
      this.database.update(this.id, 'video', userData, { updateUserData: true }, (res) => {
        Notify.create({
          message: 'User data updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
    },
    update () {
      var resource = {
        description: this.video.description,
        author: this.video.author
      }
      this.database.update(this.id, 'video', resource, { updateUserData: false }, (res) => {
        Notify.create({
          message: 'Video updated!',
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
      return this.$selectedTopic.get() && !this.$selectedTopic.find(this.video._id)
    },
    topicAdd () {
      var obj = {
        topic: this.$selectedTopic.get().id,
        media: this.video._id,
        type: 'video'
      }
      this.database.add('resource', obj, (res) => {
        this.$selectedTopic.add(this.video._id)
      })
    }
  }
}
</script>

<style>

.q-video {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 25px;
  height: 0;
}
.q-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
