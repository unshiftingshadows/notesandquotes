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
            <q-input float-label="Title" v-model="title" dark @keydown="keydown" autofocus />
          </div>
          <div class="col-3">
            <q-checkbox v-model="numbered" label="Numbered?" dark @keydown="keydown" />
          </div>
        </div>
        <q-list no-border dense>
          <q-item v-for="(item, index) in points" :key="index">
            <q-item-side v-if="!numbered" icon="fas fa-chevron-right" />
            <q-item-side v-if="numbered">{{ (index+1).toString() }}</q-item-side>
            <q-item-main>
              <q-input placeholder="Some title..." ref="outlinepointtitle" v-model="points[index].title" dark @keydown="keydown" /><br/>
              <q-input placeholder="Some text..." ref="outlinepointtext" type="textarea" v-model="points[index].text" dark :min-rows="2" :max-height="100" @keydown="keydown" />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side v-if="!numbered" icon="fas fa-chevron-right" />
            <q-item-side v-if="numbered">{{ (points.length+1).toString() }}</q-item-side>
            <q-item-main>
              <q-input placeholder="Some title..." ref="newpoint" v-model="newPoint" dark @keyup.enter="addPoint" :after="[{ icon: 'fas fa-plus', handler () {addPoint()} }]" @keydown="keydown" />
            </q-item-main>
          </q-item>
        </q-list>
      </div>
      <div class="col-12">
        <q-chips-input v-model="tags" float-label="Tags" dark @keydown="keydown" />
      </div>
      <div class="col-12">
        <q-chips-input v-model="bibleRefs" float-label="Bible Refs" color="secondary" dark @keydown="keydown" />
      </div>
      <div class="col-12">
        <q-input v-model="notes" type="textarea" :max-height="100" :min-rows="2" float-label="Notes" dark @keydown="keydown" />
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
        <q-input type="number" v-model="location.start" v-if="locationType !== 'None'" :float-label="locationType + ' Start'" dark frame-color="secondary" @keydown="keydown" />
      </div>
      <div class="col-6">
        <q-input type="number" v-model="location.end" v-if="locationType !== 'None'" :float-label="locationType + ' End'" dark frame-color="secondary" @keydown="keydown" />
      </div>
      <div class="col-12">
        <q-btn v-if="formType === 'Add'" color="primary" @click="addOutline(true)" class="on-left">Add</q-btn>
        <q-btn v-if="formType === 'Edit'" color="primary" @click="updateOutline" class="on-left">Update</q-btn>
        <q-btn v-if="formType === 'Edit'" color="negative" @click="removeOutline">Remove</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
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
      newPoint: ''
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
      this.bibleRefsParse = value.map(e => { return this.$bible.readable(e) })
    }
  },
  methods: {
    init (isNew, saveBasics) {
      if (isNew) {
        console.log('new')
        if (!saveBasics) {
          this.locationType = 'None'
          this.tags = []
        }
        this.title = ''
        this.points = []
        this.character = ''
        this.bibleRefs = []
        this.notes = ''
        this.location = {
          start: 0,
          end: 0
        }
        this.numbered = false
        this.newPoint = ''
      } else {
        this.title = this.outline.title
        this.points = this.outline.points.map(e => { return { title: e.split('%%')[0], text: e.split('%%')[1] || '' } })
        this.tags = this.outline.tags
        this.bibleRefs = this.outline.bibleRefs.map(e => { return this.$bible.osis(e) })
        this.notes = this.outline.notes
        this.locationType = this.outline.locationType
        this.location = this.outline.location
        this.numbered = this.outline.numbered
        this.newPoint = ''
      }
    },
    addOutline (close) {
      console.log('add outline')
      var outlineObj = {
        title: this.title,
        location: this.location,
        locationType: this.locationType,
        mediaType: this.type,
        mediaid: this.id,
        points: this.points.map(e => { return e.title + '%%' + e.text }),
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes,
        numbered: this.numbered
      }
      if (this.type === 'movie') {
        outlineObj.character = this.character
      }
      this.$firebase.list('outline').add(outlineObj).then((res) => {
        outlineObj._id = res.id
        if (close) {
          this.modalFin()
        }
      })
    },
    updateOutline () {
      console.log('update outline')
      var outlineObj = {
        title: this.title,
        location: this.location,
        locationType: this.locationType,
        points: this.points.map(e => { return e.title + '%%' + e.text }),
        tags: this.tags,
        bibleRefs: this.bibleRefsParse,
        notes: this.notes,
        numbered: this.numbered
      }
      if (this.type === 'movie') {
        outlineObj.author = this.character
      }
      console.log(this.outline)
      this.$firebase.list('outline').doc(this.outline._id).update(outlineObj).then((res) => {
        this.modalFin()
      })
    },
    removeOutline () {
      console.log('remove outline')
      this.$firebase.list('outline').doc(this.outline._id).delete().then((res) => {
        this.modalFin(true)
      })
    },
    addPoint () {
      // this.$refs.outlinepoint.forEach((point) => {
      //   console.log(point)
      //   point.focused = false
      // })
      this.points.push({ title: this.newPoint, text: '' })
      this.newPoint = ''
      this.$refs.newpoint.focus()
    },
    keydown (e) {
      // console.log('pressed...', e)
      if (e.keyCode === 13 && e.metaKey && this.formType === 'Add') {
        this.addOutline(!e.shiftKey)
        if (e.shiftKey) {
          this.init(true, true)
        }
      }
    }
  }
}
</script>

<style>
</style>
