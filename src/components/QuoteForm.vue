<template>
  <div style="padding: 30px">
    <div class="row gutter-sm">
      <div class="col-12">
        <h4>{{ formType }} Quote</h4>
      </div>
      <div class="col-12">
        <q-input v-model="text" type="textarea" :max-height="100" :min-rows="3" float-label="Quote Text" autofocus ref="quoteInput" dark />
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
      <div class="col-12">
        <q-input type="number" v-model="location" v-if="locationType !== 'None'" :float-label="locationType" dark frame-color="secondary" />
      </div>
      <div class="col-12">
        <q-btn v-if="formType === 'Add'" color="primary" @click="addQuote">Add</q-btn>
        <q-btn v-if="formType === 'Edit'" color="primary" @click="updateQuote">Update</q-btn>
        <q-btn v-if="formType === 'Edit'" color="negative" @click="removeQuote">Remove</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import * as Bible from '../statics/bible.js'

export default {
  props: ['mediaid', 'media', 'mediaType', 'quote', 'modalFin', 'formType'],
  data () {
    return {
      id: this.mediaid,
      text: this.quote.text || '',
      character: '',
      tags: [],
      bibleRefs: [],
      notes: '',
      locationType: 'None',
      location: 0,
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
      quoteObj: this.quote,
      bibleRefsParse: []
      // bibleTags: {}
    }
  },
  watch: {
    quote (value) {
      this.text = value.text
    },
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
        if (this.quote) {
          this.text = this.quote.text
        } else {
          this.text = ''
        }
        this.character = ''
        this.tags = []
        this.bibleRefs = []
        this.notes = ''
        this.locationType = 'None'
        this.location = 0
        this.$refs.quoteInput.focus()
      } else {
        this.text = this.quote.text
        this.tags = this.quote.tags
        this.bibleRefs = []
        this.quote.bibleRefs.forEach((ref) => {
          if (ref !== {}) {
            this.bibleRefs.push(Bible.stringBibleRef(ref))
          }
        })
        this.notes = this.quote.notes
        this.locationType = this.quote.locationType
        this.location = this.quote.location
      }
    },
    addQuote () {
      console.log('add quote')
      var quoteObj = {
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
        quoteObj.character = this.character
      }
      this.database.add('quote', quoteObj, (res) => {
        console.log(res)
        this.modalFin(res, 'quote')
      })
    },
    updateQuote () {
      console.log('update quote')
      var quoteObj = {
        location: this.location,
        locationType: this.locationType,
        text: this.text,
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes
      }
      if (this.type === 'movie') {
        quoteObj.author = this.character
      }
      console.log(this.quote)
      this.database.update(this.quote._id, 'quote', quoteObj, { updateUserData: false }, (res) => {
        console.log(res)
        this.modalFin(res)
      })
    },
    removeQuote () {
      console.log('remove quote')
      this.database.remove(this.quote._id, 'quote', (res) => {
        console.log(res)
        this.modalFin()
      })
    }
  }
}
</script>

<style>
</style>
