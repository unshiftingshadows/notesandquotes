<template>
  <q-page padding>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="col-xs-12 justify-center">
        <img :src="image.imageURL" class="responsive" />
        <q-btn icon="fas fa-link" color="primary" class="float-right" @click.native="openLink">&nbsp;&nbsp;Original Image</q-btn>
      </div>
      <div class="col-xs-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <div class="row gutter-sm">
          <div class="col-12">
            <h3>{{ image.title }}</h3>
          </div>
          <div class="col-12">
            <q-input v-model="image.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="image.author" float-label="Author" dark add-icon="fas fa-plus" />
          </div>
          <div class="col-6">
            <q-rating v-model="image.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-6">
            <q-select v-model="image.status" float-label="Status" radio :options="statusOptions" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="image.tags" float-label="Tags" dark />
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
        <media-notes :user-notes="image.notes" :update="updateNotes" :mediaid="id" media-type="image"></media-notes>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify, openURL } from 'quasar'
import MediaNotes from 'components/MediaNotes.vue'

export default {
  components: {
    MediaNotes
  },
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      image: this.$fiery(this.$firebase.view('image', this.$route.params.id), {
        onSuccess: () => {
          // if (this.image.source === 'upload') {
          //   this.$firebase.imagesRef.child(this.id).getDownloadURL().then((url) => {
          //     this.image.thumbURL = url
          //     this.image.imageURL = url
          //     this.image.pageURL = url
          //   })
          // }
          if (!this.image.tags) {
            this.image.tags = []
            this.update()
          }
          this.loading = false
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
          label: 'Viewed',
          value: 'viewed'
        }
      ]
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      // this.database.view('image', this.id, (resource, userData) => {
      //   console.log(resource, userData)
      //   if (resource.source === 'upload') {
      //     this.firebase.imagesRef.child(this.id).getDownloadURL().then((url) => {
      //       console.log('this', this)
      //       resource.thumbURL = url
      //       resource.imageURL = url
      //       resource.pageURL = url
      //       this.image = resource
      //     })
      //   } else {
      //     this.image = resource
      //   }
      //   this.userData = userData
      // })
    },
    updateNotes (notes) {
      this.image.notes = notes
      this.update()
    },
    // updateUserData () {
    //   var userData = {
    //     notes: this.userData.notes,
    //     tags: this.userData.tags,
    //     rating: this.userData.rating,
    //     status: this.userData.status
    //   }
    //   this.database.update(this.id, 'image', userData, { updateUserData: true }, (res) => {
    //     Notify.create({
    //       message: 'User data updated!',
    //       type: 'positive',
    //       position: 'bottom-left'
    //     })
    //   })
    // },
    update () {
      console.log('update', this.image)
      this.$fiery.update(this.image).then(() => {
        Notify.create({
          message: 'Image updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var resource = {
      //   description: this.image.description,
      //   author: this.image.author
      // }
      // this.database.update(this.id, 'image', resource, { updateUserData: false }, (res) => {
      //   Notify.create({
      //     message: 'Image updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
      // this.updateUserData()
    },
    openLink () {
      openURL(this.image.pageURL)
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
