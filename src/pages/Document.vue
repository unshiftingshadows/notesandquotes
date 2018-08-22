<template>
  <q-page padding>
    <div class="row gutter-md items-center">
      <div class="col-xs-12 justify-center">
        <pdf v-if="document.fileType === 'application/pdf' && fileURL !== ''" :src="fileURL" />
      </div>
      <div class="col-xs-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <h3>{{ document.title }}</h3>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="document.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
          </div>
          <div class="col-6">
            <q-chips-input v-model="document.author" float-label="Author" dark add-icon="fas fa-plus" />
          </div>
          <div class="col-6">
            <q-rating v-model="userData.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
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
        <media-notes :user-notes="userData.notes" :update="updateNotes" :mediaid="id" media-type="document"></media-notes>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import pdf from 'vue-pdf'
// import pdf from 'pdfjs-dist'
import MediaNotes from 'components/MediaNotes.vue'

export default {
  components: {
    pdf,
    MediaNotes
  },
  name: 'Document',
  data () {
    return {
      id: this.$route.params.id,
      document: {
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
          label: 'Viewed',
          value: 'viewed'
        }
      ],
      fileURL: '',
      pdfLoaded: pdf === {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.database.view('document', this.id, (resource, userData) => {
        this.document = resource
        this.userData = userData
        this.firebase.documentsRef.child(this.id).getDownloadURL().then((url) => {
          this.fileURL = url
          // pdf.createLoadingTask(url)
          // this.fileURL.then(pdf => {
          //   console.log(pdf)
          // })
        })
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
      this.database.update(this.id, 'document', userData, { updateUserData: true }, (res) => {
        Notify.create({
          message: 'User data updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
    },
    update () {
      var resource = {
        description: this.document.description,
        author: this.document.author
      }
      this.database.update(this.id, 'document', resource, { updateUserData: false }, (res) => {
        Notify.create({
          message: 'Document updated!',
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
      return this.$selectedTopic.get() && !this.$selectedTopic.find(this.document._id)
    },
    topicAdd () {
      var obj = {
        topic: this.$selectedTopic.get().id,
        media: this.document._id,
        type: 'document'
      }
      this.database.add('resource', obj, (res) => {
        this.$selectedTopic.add(this.document._id)
      })
    }
  }
}
</script>

<style>
</style>
