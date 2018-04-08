<template>
  <q-page padding>
    <div class="row gutter-md justify-center">
      <div class="col-xs-12 justify-center" v-if="linkIsVideo">
        <q-video :src="embedURL" />
      </div>
      <div class="col-xs-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fa-check" disable color="positive" v-if="!showTopicAdd()" />
          <q-btn label="Add" icon="fa-plus" @click.native="topicAdd" v-if="showTopicAdd()" />
        </span>
        <h3>{{ composition.title }}</h3>
      </div>
      <div class="col-xs-12 col-md-10">
        <div class="composition-content">
          <p style="white-space: pre-wrap">{{ composition.text }}</p>
        </div>
      </div>
      <div class="col-xs-12 col-md-10">
        <q-btn color="primary" @click.native="editText = true" class="float-right">Edit Text</q-btn>
      </div>
      <div class="row gutter-sm">
        <div class="col-12">
          <q-input v-model="composition.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
        </div>
        <div class="col-6">
          <q-chips-input v-model="composition.author" float-label="Author" dark add-icon="fas fa-plus" />
        </div>
        <div class="col-6">
          <q-input v-model="composition.url" float-label="Link" dark />
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
        <media-notes :user-notes="userData.notes" :update="updateNotes" :mediaid="id" media-type="composition"></media-notes>
      </div>
    </div>
    <q-modal v-model="editText" content-classes="edit-modal" @hide="update">
      <q-icon name="fa-close" size="2rem" @click.native="editText = false" class="float-right cursor-pointer" />
      <h4>Edit Text</h4>
      <markdown-editor v-model="composition.text" :configs="editorConfigs" ref="markdownEditor" />
    </q-modal>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import MediaNotes from 'components/MediaNotes.vue'
import markdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  components: {
    MediaNotes,
    markdownEditor
  },
  data () {
    return {
      id: this.$route.params.id,
      composition: {
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
      ],
      editText: false,
      editorConfigs: {
        spellChecker: true,
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image']
      },
      linkIsVideo: false,
      embedURL: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.database.view('composition', this.id, (resource, userData) => {
        this.composition = resource
        this.checkVideo()
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
      this.database.update(this.id, 'composition', userData, { updateUserData: true }, (res) => {
        Notify.create({
          message: 'User data updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
    },
    update () {
      var resource = {
        description: this.composition.description,
        author: this.composition.author,
        url: this.composition.url,
        text: this.composition.text
      }
      this.database.update(this.id, 'composition', resource, { updateUserData: false }, (res) => {
        this.checkVideo()
        Notify.create({
          message: 'Composition updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      this.updateUserData()
    },
    checkVideo () {
      var {id, service} = this.$videoId(this.composition.url)
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
      console.log('remove not implemented...')
    },
    showTopicAdd () {
      return this.$selectedTopic.get() && !this.$selectedTopic.find(this.composition._id)
    },
    topicAdd () {
      var obj = {
        topic: this.$selectedTopic.get().id,
        media: this.composition._id,
        type: 'composition'
      }
      this.database.add('resource', obj, (res) => {
        this.$selectedTopic.add(this.composition._id)
      })
    }
  }
}
</script>

<style>

.edit-modal {
  padding: 30px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .edit-modal {
    min-width: 500px;
    width: 500px;
  }
}

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
