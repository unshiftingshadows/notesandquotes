<template>
  <q-page padding>
    <div class="row gutter-md items-center">
      <div class="col-12">
        <span class="float-right">
          <q-btn-group>
            <q-btn label="Add" icon="fa-plus" color="primary" @click.native="openAdd" />
            <q-btn label="Select" icon="fa-plus" color="primary" @click.native="setTopic" />
          </q-btn-group>
        </span>
        <h3>{{ title }}</h3>
      </div>
      <div class="col-12-sm col-6">
        <q-input v-model="premise" type="textarea" :max-height="100" :min-rows="2" float-label="Premise" dark />
      </div>
      <div class="col-12-sm col-6">
        <q-input v-model="conclusion" type="textarea" :max-height="100" :min-rows="2" float-label="Conclusion" dark />
      </div>
      <div class="col-12">
        <markdown-editor v-model="notes" :configs="editorConfigs" @input="handleInput" ref="markdown" />
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

    <q-modal ref="addModal" v-model="showAdd" content-classes="add-media-modal">
      <q-icon name="fa-close" size="2rem" @click.native="closeAdd" class="float-right cursor-pointer" />
      <add :modal-fin="closeAdd" ref="addMedia" />
    </q-modal>
  </q-page>
</template>

<script>
import { Notify, Dialog } from 'quasar'
import * as Bible from '../statics/bible.js'
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import Add from 'components/AddMedia.vue'
// import CodeMirror from 'codemirror'

var refVal = Bible.refValidate

export default {
  components: {
    Add,
    markdownEditor
  },
  data () {
    return {
      id: this.$route.params.id,
      title: '',
      tags: [],
      notes: '',
      premise: '',
      conclusion: '',
      bibleRefParse: [],
      bibleRefs: [],
      resources: [],
      editorConfigs: {
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image']
      },
      showAdd: false
    }
  },
  validations: {
    bibleRefs: {
      $each: {
        refVal
      }
    }
  },
  computed: {
    simplemde () {
      return this.$refs.markdown.simplemde
    }
  },
  watch: {
    bibleRefs: function (userRefList) {
      this.bibleRefParse = {}
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
      this.simplemde.codemirror.setOption('extraKeys', {
        Tab: function (cm) {
          console.log(cm)
          cm.replaceSelection('new')
        }
      })
      // Defines the mode...
      // Right now it just selects things with double-quotes
      // It also overrides the spellcheck mode that I was enjoying
      // How to get 2 modes active
      // CodeMirror.defineMode('strings', function () {
      //   return {
      //     startState: function () { return { inString: false } },
      //     token: function (stream, state) {
      //       // If a string starts here
      //       if (!state.inString && stream.peek() === '"') {
      //         stream.next()
      //         state.inString = true
      //       }

      //       if (state.inString) {
      //         if (stream.skipTo('"')) {
      //           stream.next()
      //           state.inString = false
      //         } else {
      //           stream.skipToEnd()
      //         }
      //         return 'string'
      //       } else {
      //         stream.skipTo('"') || stream.skipToEnd()
      //         return null
      //       }
      //     }
      //   }
      // })
      // this.simplemde.codemirror.setOption('mode', 'strings')
      // NOTE: Currently not being used -- in the future, moving to
      // quill might be a better option for adding resources inline
      //
      // Otherwise, a complicated bracket notation could be used...
      // but would really mess up the visual of adding notes cleanly
      // and quickly
      //
      // Same needs to be considered when implementing in the Builder
      this.database.view('topic', this.id, (resource, userData) => {
        this.title = resource.title
        this.notes = resource.notes
        this.premise = resource.premise
        this.conclusion = resource.conclusion
        this.tags = resource.tags
        resource.bibleRefs.forEach((ref) => {
          if (ref !== {}) {
            this.bibleRefs.push(Bible.stringBibleRef(ref))
          }
        })
        resource.resources.forEach((res) => {
          if (res !== {}) {
            this.resources.push(res.media)
          }
        })
      })
    },
    update () {
      var obj = {
        notes: this.notes,
        premise: this.premise,
        conclusion: this.conclusion,
        tags: this.tags,
        bibleRefs: this.bibleRefParse
      }
      this.database.update(this.id, 'topic', obj, { updateUserData: false }, (res) => {
        Notify.create({
          message: 'Topic updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
    },
    remove () {
      Dialog.create({
        title: 'Confirm',
        message: 'Are you sure you want to remove this topic?',
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
    setTopic () {
      this.$selectedTopic.set({
        title: this.title,
        id: this.id,
        resources: this.resources
      })
      this.$router.push({ name: 'dashboard' })
    },
    openAdd () {
      this.showAdd = true
    },
    closeAdd () {
      this.showAdd = false
    },
    handleInput (value, other) {
      console.log(value)
      console.log(this.$refs)
    }
  }
}
</script>

<style>

.cm-string {
  background: red;
}

/*@import '~simplemde/dist/simplemde.min.css'*/
@import '../statics/simplemde-dark-theme.min.css'

</style>
