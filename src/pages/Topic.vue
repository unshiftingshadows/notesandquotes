<template>
  <q-page padding>
    <q-spinner color="primary" class="absolute-center" size="3rem" v-if="loading && !topic.errMessage" />
    <h3 v-if="topic.errMessage">Sorry...but there was an error...</h3>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="col-12">
        <span class="float-right">
          <q-btn-group>
            <q-btn label="Add" icon="fas fa-plus" color="primary" @click.native="openAdd" />
            <q-btn label="Select" icon="fas fa-plus" color="primary" @click.native="setTopic" />
          </q-btn-group>
        </span>
        <h3>{{ topic.title }}</h3>
      </div>
      <div class="col-12-sm col-6">
        <q-input v-model="topic.premise" type="textarea" :max-height="100" :min-rows="2" float-label="Premise" @blur="update" dark />
      </div>
      <div class="col-12-sm col-6">
        <q-input v-model="topic.conclusion" type="textarea" :max-height="100" :min-rows="2" float-label="Conclusion" @blur="update" dark />
      </div>
      <div class="col-12">
        <!-- <markdown-editor v-model="notes" :configs="editorConfigs" @input="handleInput" ref="markdown" /> -->
        <!-- <vue-editor
          ref="editor"
          :editorToolbar="toolbarContent"
          v-model="topic.notes"
        /> -->
        <topic-notes :section-order="topic.sectionOrder" :new-section="newSection" :delete-section="deleteSection" />
      </div>
      <!-- <div class="col-12">
        <q-chips-input v-model="topic.tags" float-label="Tags" dark />
      </div>
      <div class="col-12">
        <q-chips-input v-model="topic.bibleRefs" float-label="Bible Refs" dark />
      </div> -->
      <div class="col-12">
        <q-btn color="primary" @click="update">Update</q-btn>
        <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
      </div>
    </div>

    <q-modal ref="addModal" v-model="showAdd" content-classes="add-media-modal">
      <q-icon name="fas fa-times" size="2rem" @click.native="closeAdd" class="float-right cursor-pointer" />
      <add :modal-fin="closeAdd" ref="addMedia" />
    </q-modal>
  </q-page>
</template>

<script>
import { Notify, Dialog } from 'quasar'
// import * as Bible from '../statics/bible.js'
import { VueEditor } from 'vue2-editor'
// import markdownEditor from 'vue-simplemde/src/markdown-editor'
import Add from 'components/AddMedia.vue'
import TopicNotes from 'components/TopicNotes.vue'
// import CodeMirror from 'codemirror'

// var refVal = Bible.refValidate

export default {
  components: {
    Add,
    TopicNotes,
    // markdownEditor
    VueEditor
  },
  name: 'Topic',
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      topic: this.$fiery(this.$firebase.view('topic', this.$route.params.id), {
        onSuccess: () => {
          if (this.topic.premise || this.topic.premise === '') {
            console.log('premise loaded')
            this.loading = false
          } else {
            this.loading = true
          }
        }
      }),
      bibleRefParse: [],
      toolbarContent: [
        [{ 'header': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
      ],
      // editorConfigs: {
      //   toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image']
      // },
      showAdd: false
    }
  },
  // validations: {
  //   bibleRefs: {
  //     $each: {
  //       refVal
  //     }
  //   }
  // },
  // computed: {
  //   simplemde () {
  //     return this.$refs.markdown.simplemde
  //   }
  // },
  watch: {
    'topic.bibleRefs': function (value) {
      this.bibleRefParse = value.map(e => { return this.$bible.osis(e) })
      // userRefList.forEach((ref) => {
      //   var refObj = Bible.parseBibleRef(ref)
      //   this.bibleRefParse.push(refObj)
      // })
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    update () {
      console.log('update', this.topic)
      this.$fiery.update(this.topic).then(() => {
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
        title: this.topic.title,
        id: this.id
      })
      this.$router.push({ name: 'dashboard' })
    },
    newSection (id) {
      this.topic.sectionOrder.push(id)
      this.$fiery.update(this.topic)
    },
    deleteSection (id) {
      this.topic.sectionOrder.splice(this.topic.sectionOrder.indexOf(id), 1)
      this.$fiery.update(this.topic)
    },
    openAdd () {
      this.showAdd = true
    },
    closeAdd () {
      this.showAdd = false
    },
    handleInput (value, other) {
      // console.log(value)
      // console.log(this.$refs)
    }
  }
}
</script>

<style>

/* .cm-string {
  background: red;
} */
.ql-editor {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.ql-picker-label {
  color: #bbb !important;
}

.ql-fill {
  fill: #bbb !important;
}

.ql-stroke {
  stroke: #bbb !important;
}

.add-media-modal {
  padding: 30px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .add-media-modal {
    min-width: 500px;
    width: 500px;
  }
}

/*@import '~simplemde/dist/simplemde.min.css'*/
/* @import '../statics/simplemde-dark-theme.min.css' */

</style>
