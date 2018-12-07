<template>
  <q-page padding>
    <q-spinner color="primary" class="absolute-center" size="3rem" v-if="loading && !document.errMessage" />
    <h3 v-if="document.errMessage">Sorry...but there was an error...</h3>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="col-xs-12 justify-center">
        <q-btn v-if="fileTypes.includes(document.fileType) && fileURL !== ''" @click.native="wordRead = true">read</q-btn>
        <q-btn v-if="document.fileType === 'application/pdf' && fileURL !== ''" @click.native="pdfRead = true">read</q-btn>
        <q-btn v-if="document.fileType === 'application/pdf' && fileURL !== ''" @click.native="$refs.pdf.print()">print</q-btn>
        <!-- <q-btn v-if="document.fileType === 'text/html' && fileURL !== ''" @click.native="htmlRead = true">read</q-btn>
        <q-btn v-if="document.fileType === 'text/csv' && fileURL !== ''" @click.native="textRead = true">read</q-btn> -->
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
            <q-rating v-model="document.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="document.tags" float-label="Tags" dark />
          </div>
          <div class="col-12">
            <q-input v-model="document.citation" type="textarea" :max-height="100" :min-rows="2" float-label="Citation" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click="update">Update</q-btn>
            <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <media-notes :user-notes="document.notes" :update="updateNotes" :mediaid="id" media-type="document"></media-notes>
      </div>
    </div>
    <q-modal v-if="document.fileType === 'application/pdf' && fileURL !== ''" v-model="pdfRead" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="pdfRead = false" />
      <q-btn color="primary" size="xl" class="overlay-button fixed z-max" style="left: 0px; top: 50%; transform: translate(50%, -50%); -webkit-transform: translate(50%, -50%);" icon="fas fa-chevron-left" @click="prevPage" />
      <q-btn color="primary" size="xl" class="overlay-button fixed z-max" style="right: 0px; top: 50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%);" icon="fas fa-chevron-right" @click="nextPage" />
      <!-- <q-btn-group class="fixed z-max" style="bottom: 0px; left: 50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%);">
        <q-btn color="primary" size="xl" class="overlay-button" icon="fas fa-chevron-left" @click="prevPage" />
        <q-btn color="primary" size="xl" class="overlay-button" icon="fas fa-chevron-right" @click="nextPage" />
      </q-btn-group> -->
      <pdf
        :src="fileURL"
        :page="currentPage"
        ref="pdf"
        @num-pages="pageCount = $event"
        @page-loaded="currentPage = $event"
        @link-clicked="currentPage = $event"
        v-touch-swipe.horizontal="handleSwipe"
      />
    </q-modal>
    <q-modal v-if="fileTypes.includes(document.fileType) && fileURL !== ''" v-model="wordRead" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="wordRead = false" />
      <iframe :src="'https://view.officeapps.live.com/op/view.aspx?src=https://storage.googleapis.com/notes-and-quotes-977a3.appspot.com/documents/' + id" width='100%' height='100%' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe>
      <!-- <iframe :src="'http://docs.google.com/gview?url=' + fileURL + '&embedded=true'" width='100%' height='100%' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe> -->
    </q-modal>
    <!-- <q-modal v-if="document.fileType === 'text/html' && fileURL !== ''" v-model="htmlRead" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="htmlRead = false" />
    </q-modal>
    <q-modal v-if="document.fileType === 'text/csv' && fileURL !== ''" v-model="textRead" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="textRead = false" />
      <embed :src="fileURL" width="100%" type="text/plain" id="text-object">
    </q-modal> -->
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
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      document: this.$fiery(this.$firebase.view('document', this.$route.params.id), {
        onSuccess: () => {
          if (this.document.status) {
            this.$firebase.documentsRef.child(this.id).getDownloadURL().then((url) => {
              this.fileURL = url
              this.loading = false
            })
          } else {
            this.loading = true
          }
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
          label: 'Viewed',
          value: 'viewed'
        }
      ],
      fileTypes: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      pdfRead: false,
      wordRead: false,
      htmlRead: false,
      textRead: false,
      fileURL: '',
      currentPage: 1,
      pageCount: 0
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      // this.database.view('document', this.id, (resource, userData) => {
      //   this.document = resource
      //   this.userData = userData
      //   this.firebase.documentsRef.child(this.id).getDownloadURL().then((url) => {
      //     this.fileURL = url
      //     // pdf.createLoadingTask(url)
      //     // this.fileURL.then(pdf => {
      //     //   console.log(pdf)
      //     // })
      //   })
      // })
    },
    nextPage () {
      if (this.currentPage !== this.pageCount) {
        this.currentPage++
      }
    },
    prevPage () {
      if (this.currentPage !== 1) {
        this.currentPage--
      }
    },
    handleSwipe (obj) {
      if (obj.direction === 'left') {
        this.nextPage()
      } else if (obj.direction === 'right') {
        this.prevPage()
      } else {
        console.error('not valid swipe direction: ', obj)
      }
    },
    updateNotes (notes) {
      this.document.notes = notes
      this.update()
    },
    // updateUserData () {
    //   var userData = {
    //     notes: this.userData.notes,
    //     tags: this.userData.tags,
    //     rating: this.userData.rating,
    //     status: this.userData.status
    //   }
    //   this.database.update(this.id, 'document', userData, { updateUserData: true }, (res) => {
    //     Notify.create({
    //       message: 'User data updated!',
    //       type: 'positive',
    //       position: 'bottom-left'
    //     })
    //   })
    // },
    update () {
      console.log('update', this.document)
      this.$fiery.update(this.document).then(() => {
        Notify.create({
          message: 'Document updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var resource = {
      //   description: this.document.description,
      //   author: this.document.author
      // }
      // this.database.update(this.id, 'document', resource, { updateUserData: false }, (res) => {
      //   Notify.create({
      //     message: 'Document updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
      // this.updateUserData()
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

.pdf-viewer {
  position: relative;
  width: 100%;
}

.overlay-button {
  opacity: .5;
}

.overlay-button:hover {
  opacity: 1;
}

#text-object pre {
  color: var(--q-color-white) !important;
}

</style>
