<template>
  <div style="padding: 30px">
    <div class="row gutter-sm">
      <div class="col-12">
        <h4>{{ formType }} Outline</h4>
      </div>
      <div class="col-12">
        <!-- Expandable space for outline points and notes -->
        <!-- Would like to have potential for reordering -->
        <div class="row">
          <div class="col-9">
            <q-input float-label="Title" v-model="title" dark />
          </div>
          <div class="col-3">
            <q-checkbox v-model="numbered" label="Numbered?" dark />
          </div>
        </div>
        <q-list no-border dense>
          <q-item v-for="(item, index) in points" :key="index">
            <q-item-side v-if="!numbered" icon="fa-chevron-right" />
            <q-item-side v-if="numbered" :letter="(index+1).toString()" />
            <q-item-main>
              <q-input placeholder="Something..." ref="outlinepoint" v-model="item.point" dark />
              <q-input v-model="item.note" type="textarea" :max-height="100" :min-rows="2" placeholder="Note..." ref="outlinenote" dark />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side v-if="!numbered" icon="fa-chevron-right" />
            <q-item-side v-if="numbered" :letter="(points.length+1).toString()" />
            <q-item-main>
              <q-input placeholder="Something..." ref="newpoint" v-model="newPoint.point" dark @keyup.enter="addPoint" :after="[{ icon: 'fa-plus', handler () {addPoint()} }]" />
              <q-input v-model="item.note" type="textarea" :max-height="100" :min-rows="2" placeholder="Note..." ref="outlinenote" dark />
            </q-item-main>
          </q-item>
        </q-list>
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
        <q-btn v-if="formType === 'Add'" color="primary" @click="addOutline">Add</q-btn>
        <q-btn v-if="formType === 'Edit'" color="primary" @click="updateOutline">Update</q-btn>
        <q-btn v-if="formType === 'Edit'" color="negative" @click="removeOutline">Remove</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import * as Bible from '../statics/bible.js'

export default {
  props: ['mediaid', 'media', 'mediaType', 'outline', 'modalFin', 'formType'],
  data () {
    return {
      id: this.mediaid,
      title: '',
      points: [],
      tags: [],
      bibleRefs: [],
      notes: '',
      locationType: 'None',
      location: {
        start: 0,
        end: 0
      },
      numbered: false,
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
      outlineObj: this.outline,
      bibleRefsParse: [],
      // bibleTags: {}
      newPoint: {
        point: '',
        note: ''
      }
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
        this.points = [{
          point: '',
          note: ''
        }]
        this.character = ''
        this.tags = []
        this.bibleRefs = []
        this.notes = ''
        this.locationType = 'None'
        this.location = {
          start: 0,
          end: 0
        }
        this.numbered = false
      } else {
        this.points = this.outline.points
        this.tags = this.outline.tags
        this.bibleRefs = []
        this.outline.bibleRefs.forEach((ref) => {
          if (ref !== {}) {
            this.bibleRefs.push(Bible.stringBibleRef(ref))
          }
        })
        this.notes = this.outline.notes
        this.locationType = this.outline.locationType
        this.location = this.outline.location
        this.numbered = this.outline.numbered
      }
    },
    addOutline () {
      console.log('add outline')
      var outlineObj = {
        location: this.location,
        locationType: this.locationType,
        mediaType: this.type,
        mediaid: this.id,
        points: this.points,
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes,
        numbered: this.numbered
      }
      if (this.type === 'movie') {
        outlineObj.character = this.character
      }
      this.database.add('outline', outlineObj, (res) => {
        console.log(res)
        this.modalFin()
      })
    },
    updateOutline () {
      console.log('update outline')
      var outlineObj = {
        location: this.location,
        locationType: this.locationType,
        points: this.points,
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes,
        numbered: this.numbered
      }
      if (this.type === 'movie') {
        outlineObj.author = this.character
      }
      console.log(this.outline)
      this.database.update(this.outline._id, 'outline', outlineObj, { updateUserData: false }, (res) => {
        console.log(res)
        this.modalFin()
      })
    },
    removeOutline () {
      console.log('remove outline')
      this.database.remove(this.outline._id, 'outline', (res) => {
        console.log(res)
        this.modalFin()
      })
    },
    addPoint () {
      // this.$refs.outlinepoint.forEach((point) => {
      //   console.log(point)
      //   point.focused = false
      // })
      this.points.push(this.newPoint)
      this.newPoint = {
        point: '',
        note: ''
      }
      this.$refs.newpoint.focus()
    }
  }
}
</script>

<style>
</style>
