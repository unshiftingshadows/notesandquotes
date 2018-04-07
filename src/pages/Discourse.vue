<template>
  <q-page padding>
    <div class="row gutter-md items-center">
      <div class="col-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <h3>{{ discourse.title }}</h3>
        <div class="row gutter-sm">
          <div class="col-6">
            <!-- <q-input v-model="discourse.author" float-label="Author" dark /> -->
            <p>{{ discourse.author }}</p>
          </div>
          <div class="col-6">
            <q-input v-model="discourse.eventName" float-label="Event Name" dark />
          </div>
          <div class="col-12">
            <q-input v-model="discourse.url" float-label="Link" dark />
          </div>
          <div class="col-6">
            <q-select v-model="userData.status" float-label="Status" radio :options="statusOptions" dark />
          </div>
          <div class="col-6">
            <q-rating v-model="userData.rating" :max="5" icon="fa-star" size="1.5em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="userData.tags" float-label="Tags" dark @blur="updateUserData" />
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
        <media-notes :user-notes.sync="userData.notes" :update="updateNotes" :mediaid="id" media-type="discourse"></media-notes>
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
  data () {
    return {
      id: this.$route.params.id,
      discourse: {},
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
      this.database.view('discourse', this.id, (resource, userData) => {
        this.discourse = resource
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
      this.database.update(this.id, 'discourse', userData, { updateUserData: true }, (res) => {
        Notify.create({
          message: 'User data updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
    },
    update () {
      console.log('update', this.discourse)
      var resource = {
        eventName: this.discourse.eventName,
        citation: this.discourse.citation
      }
      this.database.update(this.id, 'discourse', resource, { updateUserData: false }, (res) => {
        Notify.create({
          message: 'Discourse updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      this.updateUserData()
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

@media screen and (min-width: 1200px) {
  .media-page {
    margin: 0 auto;
    max-width: 1000px;
  }
}

</style>
