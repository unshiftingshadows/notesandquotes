<template>
  <q-page padding>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="col-xs-12 justify-center" v-if="linkIsVideo">
        <q-video :src="embedURL" />
      </div>
      <div class="col-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <h3>{{ discourse.title }}</h3>
        <div class="row gutter-sm">
          <div class="col-6">
            <q-input v-model="discourse.eventName" float-label="Event Name" dark />
          </div>
          <div class="col-6">
            <q-datetime v-model="dateOccurred" type="date" float-label="Event Date" dark />
          </div>
          <div class="col-6">
            <q-chips-input v-model="discourse.author" float-label="Author" dark add-icon="fas fa-plus" />
          </div>
          <div class="col-6">
            <q-input v-model="discourse.url" float-label="Link" dark />
          </div>
          <div class="col-6">
            <q-select v-model="discourse.status" float-label="Status" radio :options="statusOptions" dark />
          </div>
          <div class="col-6">
            <q-rating v-model="discourse.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="discourse.tags" float-label="Tags" dark @blur="update" />
          </div>
          <div class="col-12">
            <q-input v-model="discourse.citation" float-label="Citation" type="textarea" :max-height="100" :min-rows="2" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click="update">Update</q-btn>
            <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <quote-list :mediaid="id" :media="discourse" media-type="discourse"></quote-list>
      </div>
      <div class="col-12">
        <media-notes :user-notes.sync="discourse.notes" :update="updateNotes" :mediaid="id" media-type="discourse"></media-notes>
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
      discourse: this.$fiery(this.$firebase.view('discourse', this.$route.params.id), {
        onSuccess: () => {
          this.dateOccurred = this.discourse.dateOccurred.toDate()
          this.loading = false
        }
      }),
      dateOccurred: new Date(),
      statusOptions: [
        {
          label: 'New',
          value: 'new'
        },
        {
          label: 'Viewed',
          value: 'viewed'
        }
      ],
      linkIsVideo: false,
      embedURL: ''
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      // this.database.view('discourse', this.id, (resource, userData) => {
      //   this.discourse = resource
      //   this.checkVideo()
      //   this.userData = userData
      // })
    },
    updateNotes (notes) {
      this.discourse.notes = notes
      this.update()
    },
    // updateUserData () {
    //   var userData = {
    //     notes: this.userData.notes,
    //     tags: this.userData.tags,
    //     rating: this.userData.rating,
    //     status: this.userData.status
    //   }
    //   this.database.update(this.id, 'discourse', userData, { updateUserData: true }, (res) => {
    //     Notify.create({
    //       message: 'User data updated!',
    //       type: 'positive',
    //       position: 'bottom-left'
    //     })
    //   })
    // },
    update () {
      console.log('update', this.discourse)
      this.$fiery.update(this.discourse).then(() => {
        Notify.create({
          message: 'Discourse updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var resource = {
      //   author: this.discourse.author,
      //   dateOccurred: this.discourse.dateOccurred,
      //   eventName: this.discourse.eventName,
      //   citation: this.discourse.citation,
      //   url: this.discourse.url
      // }
      // this.database.update(this.id, 'discourse', resource, { updateUserData: false }, (res) => {
      //   this.checkVideo()
      //   Notify.create({
      //     message: 'Discourse updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
      // this.updateUserData()
    },
    checkVideo () {
      var {id, service} = this.$videoId(this.discourse.url)
      if (service === 'youtube') {
        this.embedURL = 'https://www.youtube.com/embed/' + id
        this.linkIsVideo = true
      } else if (service === 'vimeo') {
        this.embedURL = 'https://player.vimeo.com/video/' + id
        this.linkIsVideo = true
      } else {
        this.linkIsVideo = false
      }
    },
    remove () {
      console.log('Remove not implemented...')
    },
    showTopicAdd () {
      return this.$selectedTopic.get() && !this.$selectedTopic.find(this.discourse._id)
    },
    topicAdd () {
      var obj = {
        topic: this.$selectedTopic.get().id,
        media: this.discourse._id,
        type: 'discourse'
      }
      this.database.add('resource', obj, (res) => {
        this.$selectedTopic.add(this.discourse._id)
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
