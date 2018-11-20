<template>
  <div style="padding: 30px">
    <div class="row gutter-sm">
      <div class="col-12">
        <h4>{{ formType }} Illustration</h4>
      </div>
      <div class="col-12">
        <q-input v-model="title" float-label="Illustration Title" dark />
      </div>
      <div class="col-12">
        <q-input v-model="text" type="textarea" :max-height="100" :min-rows="3" float-label="Illustration Text" autofocus ref="illustrationInput" dark />
      </div>
      <div class="col-12" v-if="type === 'movie'">
        <q-input v-model="character" float-label="Character" dark />
      </div>
      <div class="col-12">
        <q-chips-input v-model="tags" float-label="Tags" dark />
      </div>
      <div class="col-12">
        <q-chips-input v-model="bibleRefs" float-label="Bible Refs" color="secondary" dark />
      </div>
      <div class="col-12">
        <q-input v-model="notes" type="textarea" :max-height="100" :min-rows="2" float-label="Notes" dark />
      </div>
      <div class="col-12">
        <q-select
          float-label="Location Type"
          v-model="locationType"
          :options="selectOptions"
          dark
        />
      </div>
      <div class="col-6">
        <q-input type="number" v-model="location.start" v-if="locationType !== 'None'" :float-label="locationType + ' Start'" dark frame-color="secondary" />
      </div>
      <div class="col-6">
        <q-input type="number" v-model="location.end" v-if="locationType !== 'None'" :float-label="locationType + ' End'" dark frame-color="secondary" />
      </div>
      <div class="col-12">
        <q-btn v-if="formType === 'Add'" color="primary" @click="addIllustration" class="on-left">Add</q-btn>
        <q-btn v-if="formType === 'Edit'" color="primary" @click="updateIllustration" class="on-left">Update</q-btn>
        <q-btn v-if="formType === 'Edit'" color="negative" @click="removeIllustration">Remove</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import * as Bible from '../statics/bible.js'

export default {
  props: ['mediaid', 'media', 'mediaType', 'illustration', 'modalFin', 'formType'],
  data () {
    return {
      id: this.mediaid,
      text: '',
      title: '',
      tags: [],
      bibleRefs: [],
      notes: '',
      locationType: 'None',
      location: {
        start: 0,
        end: 0
      },
      selectOptions: [
        {
          label: 'None',
          value: 'None'
        },
        {
          label: 'Page',
          value: 'Page'
        },
        {
          label: 'Chapter',
          value: 'Chapter'
        },
        {
          label: 'Kindle',
          value: 'Kindle'
        },
        {
          label: 'Other',
          value: 'Other'
        }
      ],
      mediaObj: this.media,
      type: this.mediaType,
      illustrationObj: this.illustration,
      bibleRefsParse: []
      // bibleTags: {},
    }
  },
  watch: {
    media (value) {
      this.mediaObj = value
    },
    mediaType (value) {
      this.type = value
    },
    tags (value) {
      this.tags = value
    },
    bibleRefs (value) {
      this.bibleRefsParse = []
      value.forEach((ref) => {
        var refObj = Bible.parseBibleRef(ref)
        this.bibleRefsParse.push(refObj)
        // var bibleTag = refObj.book + refObj.chapter
        // this.bibleTags[bibleTag] = true
      })
    }
  },
  methods: {
    init (isNew) {
      if (isNew) {
        console.log('new')
        this.text = ''
        this.title = ''
        this.character = ''
        this.tags = []
        this.bibleRefs = []
        this.notes = ''
        this.locationType = 'None'
        this.location = 0
      } else {
        this.text = this.illustration.text
        this.title = this.illustration.title
        this.tags = this.illustration.tags
        this.bibleRefs = []
        this.illustration.bibleRefs.forEach((ref) => {
          if (ref !== {}) {
            this.bibleRefs.push(Bible.stringBibleRef(ref))
          }
        })
        this.notes = this.illustration.notes
        this.locationType = this.illustration.locationType
        this.location = this.illustration.location
      }
    },
    addIllustration () {
      console.log('add illustration')
      var illustrationObj = {
        location: this.location,
        locationType: this.locationType,
        mediaType: this.type,
        mediaid: this.id,
        text: this.text,
        title: this.title,
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes
      }
      if (this.type === 'movie') {
        illustrationObj.character = this.character
      }
      // this.database.add('illustration', illustrationObj, (res) => {
      //   console.log(res)
      //   this.modalFin(res, 'illustration')
      // })
      this.$firebase.list('illustration').add(illustrationObj).then((res) => {
        illustrationObj._id = res.id
        this.modalFin(illustrationObj, 'illustration')
      })
    },
    updateIllustration () {
      console.log('update illustration')
      var illustrationObj = {
        location: this.location,
        locationType: this.locationType,
        text: this.text,
        title: this.title,
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes
      }
      if (this.type === 'movie') {
        illustrationObj.author = this.character
      }
      console.log(this.illustration)
      this.database.update(this.illustration._id, 'illustration', illustrationObj, { updateUserData: false }, (res) => {
        console.log(res)
        this.modalFin(res)
      })
    },
    removeIllustration () {
      console.log('remove illustration')
      this.database.remove(this.illustration._id, 'illustration', (res) => {
        console.log(res)
        this.modalFin()
      })
    }
  }
}
</script>

<style>
</style>
