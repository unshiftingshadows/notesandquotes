<template>
  <q-page padding>
    <q-spinner color="primary" class="absolute-center" size="3rem" v-if="loading && !video.errMessage" />
    <h3 v-if="video.errMessage">Sorry...but there was an error...</h3>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="col-xs-12 justify-center">
        <q-video :src="video.embedURL" />
      </div>
      <div class="col-xs-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fas fa-check" disable color="positive" v-if="addState === 'y'" />
          <q-btn label="Add" icon="fas fa-plus" disable v-if="addState === 'd'" />
          <q-btn label="Add" icon="fas fa-plus" @click.native="topicAdd" v-if="addState === 'n'" />
        </span>
        <h3>{{ video.title }}</h3>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="video.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="video.author" float-label="Author" dark add-icon="fas fa-plus" />
          </div>
          <div class="col-6">
            <q-select v-model="video.status" float-label="Status" radio :options="statusOptions" dark />
          </div>
          <div class="col-6">
            <q-rating v-model="video.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="video.tags" float-label="Tags" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click="update">Update</q-btn>
            <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <media-notes :user-notes="video.notes" :update="updateNotes" :mediaid="id" media-type="video"></media-notes>
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
  name: 'Video',
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      video: this.$fiery(this.$firebase.view('video', this.$route.params.id), {
        onSuccess: () => {
          if (this.video.status) {
            if (!this.video.tags) {
              this.video.tags = []
              this.update()
            }
            this.loading = false
          } else {
            this.loading = true
          }
        }
      }),
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
      ],
      addState: this.$selectedTopic.get() && !this.$selectedTopic.find(this.$route.params.id) ? 'n' : 'y'
    }
  },
  mounted () {
    // console.log(this.$selectedTopic.get())
    // this.init()
  },
  methods: {
    init () {
      // this.database.view('video', this.id, (resource, userData) => {
      //   this.video = resource
      //   this.userData = userData
      // })
    },
    updateNotes (notes) {
      this.video.notes = notes
      this.update()
    },
    // updateUserData () {
    //   var userData = {
    //     notes: this.userData.notes,
    //     tags: this.userData.tags,
    //     rating: this.userData.rating,
    //     status: this.userData.status
    //   }
    //   this.database.update(this.id, 'video', userData, { updateUserData: true }, (res) => {
    //     Notify.create({
    //       message: 'User data updated!',
    //       type: 'positive',
    //       position: 'bottom-left'
    //     })
    //   })
    // },
    update () {
      console.log('update', this.video)
      this.$fiery.update(this.video).then(() => {
        Notify.create({
          message: 'Video updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var resource = {
      //   description: this.video.description,
      //   author: this.video.author
      // }
      // this.database.update(this.id, 'video', resource, { updateUserData: false }, (res) => {
      //   Notify.create({
      //     message: 'Video updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
      // this.updateUserData()
    },
    remove () {
      console.log('remove not implemented...')
    },
    topicAdd () {
      var obj = {
        id: this.id,
        type: 'video'
      }
      this.$selectedTopic.add(obj).then((ans) => {
        this.addState = ans ? 'y' : 'n'
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
