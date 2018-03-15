<template>
  <div style="padding: 30px">
    <div class="row gutter-sm">
      <div class="col-12">
        <h4>{{ formType }} Idea</h4>
      </div>
      <div class="col-12">
        <q-input v-model="text" type="textarea" :max-height="100" :min-rows="3" float-label="Idea Text" autofocus ref="ideaInput" dark />
      </div>
      <div class="col-12" v-if="type === 'movie'">
        <q-input v-model="character" float-label="Character" dark />
      </div>
      <div class="col-12">
        <q-chips-input v-model="tags" float-label="Tags" dark />
      </div>
      <div class="col-12">
        <q-chips-input v-model="bibleRefs" float-label="Bible Refs" dark />
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
        <q-btn v-if="formType === 'Add'" color="primary" @click="addIdea">Add</q-btn>
        <q-btn v-if="formType === 'Edit'" color="primary" @click="updateIdea">Update</q-btn>
        <q-btn v-if="formType === 'Edit'" color="negative" @click="removeIdea">Remove</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import * as Bible from '../statics/bible.js'

export default {
  props: ['mediaid', 'media', 'mediaType', 'idea', 'modalFin', 'formType'],
  data () {
    return {
      id: this.mediaid,
      text: '',
      character: '',
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
      ideaObj: this.idea,
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
        this.character = ''
        this.tags = []
        this.bibleRefs = []
        this.notes = ''
        this.locationType = 'None'
        this.location = 0
      } else {
        this.text = this.idea.text
        this.tags = this.idea.tags
        this.bibleRefs = []
        this.idea.bibleRefs.forEach((ref) => {
          if (ref !== {}) {
            this.bibleRefs.push(Bible.stringBibleRef(ref))
          }
        })
        this.notes = this.idea.notes
        this.locationType = this.idea.locationType
        this.location = this.idea.location
      }
    },
    addIdea () {
      console.log('add idea')
      var ideaObj = {
        location: this.location,
        locationType: this.locationType,
        mediaType: this.type,
        mediaid: this.id,
        text: this.text,
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes
      }
      if (this.type === 'movie') {
        ideaObj.character = this.character
      }
      this.database.add('idea', ideaObj, (res) => {
        console.log(res)
        this.modalFin(res, 'idea')
      })
    },
    updateIdea () {
      console.log('update idea')
      var ideaObj = {
        location: this.location,
        locationType: this.locationType,
        text: this.text,
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes
      }
      if (this.type === 'movie') {
        ideaObj.author = this.character
      }
      console.log(this.idea)
      this.database.update(this.idea._id, 'idea', ideaObj, { updateUserData: false }, (res) => {
        console.log(res)
        this.modalFin(res)
      })
    },
    removeIdea () {
      console.log('remove idea')
      this.database.remove(this.idea._id, 'idea', (res) => {
        console.log(res)
        this.modalFin()
      })
    }
  }
}
</script>

<style>
</style>
