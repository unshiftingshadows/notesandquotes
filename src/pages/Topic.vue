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
        <markdown-editor v-model="notes" :configs="editorConfigs" />
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
      notes: '',
      premise: '',
      conclusion: '',
      bibleRefParse: [],
      bibleRefs: [],
      resources: [],
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
      console.log('not implemented...')
    }
  }
}
</script>

<style>

/*@import '~simplemde/dist/simplemde.min.css'*/
@import '../statics/simplemde-dark-theme.min.css'

</style>
