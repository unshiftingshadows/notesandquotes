<template>
  <q-page padding>
    <q-spinner color="primary" class="absolute-center" size="3rem" v-if="loading && !note.errMessage" />
    <h3 v-if="note.errMessage">Sorry...but there was an error...</h3>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="col-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fas fa-check" disable color="positive" v-if="addState === 'y'" />
          <q-btn label="Add" icon="fas fa-plus" disable v-if="addState === 'd'" />
          <q-btn label="Add" icon="fas fa-plus" @click.native="topicAdd" v-if="addState === 'n'" />
        </span>
        <h3>{{ note.title }}</h3>
      </div>
      <div class="col-12">
        <markdown-editor v-model="note.text" :configs="editorConfigs" />
      </div>
      <div class="col-12">
        <q-chips-input v-model="note.tags" float-label="Tags" dark />
      </div>
      <div class="col-12">
        <q-chips-input v-model="note.bibleRefs" float-label="Bible Refs" dark />
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

// var refVal = Bible.refValidate

export default {
  components: {
    markdownEditor
  },
  name: 'Note',
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      note: this.$fiery(this.$firebase.view('note', this.$route.params.id), {
        onSuccess: () => {
          if (this.note.status) {
            this.loading = false
          } else {
            this.loading = true
          }
        }
      }),
      // title: '',
      // tags: [],
      // text: '',
      bibleRefParse: [],
      // bibleRefs: [],
      editorConfigs: {
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image']
      },
      addState: this.$selectedTopic.get() && !this.$selectedTopic.find(this.$route.params.id) ? 'n' : 'y'
    }
  },
  // validations: {
  //   bibleRefs: {
  //     $each: {
  //       refVal
  //     }
  //   }
  // },
  watch: {
    'note.bibleRefs': function (userRefList) {
      // this.bibleRefObj = []
      userRefList.forEach((ref) => {
        var refObj = Bible.parseBibleRef(ref)
        this.bibleRefParse.push(refObj)
        // var bibleTag = refObj.book + refObj.chapter
        // this.bibleTags[bibleTag] = true
      })
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      // this.database.view('note', this.id, (resource, userData) => {
      //   this.title = resource.title
      //   this.text = resource.text
      //   this.tags = resource.tags
      //   resource.bibleRefs.forEach((ref) => {
      //     if (ref !== {}) {
      //       this.bibleRefs.push(Bible.stringBibleRef(ref))
      //     }
      //   })
      // })
    },
    update () {
      console.log('update', this.note)
      this.$fiery.update(this.note).then(() => {
        Notify.create({
          message: 'Note updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var obj = {
      //   text: this.text,
      //   tags: this.tags,
      //   bibleRefs: this.bibleRefParse
      // }
      // this.database.update(this.id, 'note', obj, { updateUserData: false }, (res) => {
      //   Notify.create({
      //     message: 'Note updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
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
    },
    topicAdd () {
      var obj = {
        id: this.id,
        type: 'note'
      }
      this.$selectedTopic.add(obj).then((ans) => {
        this.addState = ans ? 'y' : 'n'
      })
    }
  }
}
</script>

<style>

/*@import '~simplemde/dist/simplemde.min.css'*/
@import '../statics/simplemde-dark-theme.min.css'

</style>
