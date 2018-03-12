<template>
  <q-page padding>
    <div class="row gutter-md items-center">
      <div class="col-12">
        <h3>{{ title }}</h3>
      </div>
      <div class="col-12">
        <markdown-editor v-model="text" :configs="editorConfigs" />
      </div>
      <div class="col-12">
        <q-chips-input v-model="tags" float-label="Tags" dark />
      </div>
      <div class="col-12">
        <q-chips-input v-model="bibleRefs" float-label="Bible Refs" @blur="$v.bibleRefs.$touch" :error="$v.bibleRefs.$error" dark />
      </div>
      <div class="col-12">
        <q-btn color="primary" @click="update">Update</q-btn>
        <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Notify, Dialog } from 'quasar'
import * as Bible from '../statics/bible.js'
import markdownEditor from 'vue-simplemde/src/markdown-editor'

var refVal = Bible.refValidate

export default {
  components: {
    markdownEditor
  },
  data () {
    return {
      id: this.$route.params.id,
      title: '',
      tags: [],
      text: '',
      bibleRefParse: [],
      bibleRefs: [],
      editorConfigs: {
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image']
      }
    }
  },
  validations: {
    bibleRefs: {
      $each: {
        refVal
      }
    }
  },
  watch: {
    bibleRefs: function (userRefList) {
      this.bibleRefObj = {}
      userRefList.forEach((ref) => {
        var refObj = Bible.parseBibleRef(ref)
        this.bibleRefParse.push(refObj)
        // var bibleTag = refObj.book + refObj.chapter
        // this.bibleTags[bibleTag] = true
      })
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.database.view('note', this.id, (resource, userData) => {
        this.title = resource.title
        this.text = resource.text
        this.tags = resource.tags
        resource.bibleRefs.forEach((ref) => {
          if (ref !== {}) {
            this.bibleRefs.push(Bible.stringBibleRef(ref))
          }
        })
      })
    },
    update () {
      var obj = {
        text: this.text,
        tags: this.tags,
        bibleRefs: this.bibleRefParse
      }
      this.database.update(this.id, 'note', obj, { updateUserData: false }, (res) => {
        Notify.create({
          message: 'Note updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
    },
    remove () {
      Dialog.create({
        title: 'Confirm',
        message: 'Are you sure you want to remove this note?',
        buttons: [
          {
            label: 'No',
            handler () {}
          },
          {
            label: 'Yes',
            handler: () => {
              console.log('remove not implemented...')
            }
          }
        ]
      })
    }
  }
}
</script>

<style>

/*@import '~simplemde/dist/simplemde.min.css'*/
@import '../statics/simplemde-dark-theme.min.css'

</style>
