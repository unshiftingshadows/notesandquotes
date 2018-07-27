<template>
  <div>
    <h4>Notes</h4>
    <!-- <markdown-editor v-model="notes" :configs="editorConfigs" ref="markdownEditor" /> -->
    <vue-editor
      id="editormn"
      ref="editormn"
      :editorToolbar="toolbarContent"
      v-model="notes"
    />
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
// import markdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  components: {
    VueEditor
  },
  props: ['userNotes', 'mediaid', 'mediaType', 'update'],
  data () {
    return {
      notes: this.userNotes,
      id: this.mediaid,
      type: this.mediaType,
      toolbarContent: [
        [{ 'header': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
      ],
      editorConfigs: {
        spellChecker: true,
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image']
      }
    }
  },
  // computed: {
  //   simplemde () {
  //     return this.$refs.markdownEditor.simplemde
  //   }
  // },
  mounted () {
    console.log(this.notes)
    // this.simplemde.codemirror.on('blur', this.updateNotes)
    this.$refs.editormn.quill.on('selection-change', (range, oldRange, source) => {
      if (range === null && oldRange !== null) {
        this.updateNotes()
      }
    })
  },
  watch: {
    userNotes (value) {
      console.log('update user notes', value)
      this.notes = value
    }
  },
  methods: {
    updateNotes: function () {
      this.update(this.notes)
    }
  }
}
</script>

<style>

/* @import '~simplemde/dist/simplemde.min.css'; */
/* @import '../statics/simplemde-dark-theme.min.css'; */

/* .cm-spell-error {
  background-color: rgba(255,0,0,0.2);
} */
.ql-picker-label {
  color: #bbb !important;
}

.ql-fill {
  fill: #bbb !important;
}

.ql-stroke {
  stroke: #bbb !important;
}

</style>
