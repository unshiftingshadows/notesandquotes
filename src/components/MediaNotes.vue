<template>
  <div>
    <h4>Notes</h4>
    <markdown-editor v-model="notes" :configs="editorConfigs" ref="markdownEditor" />
  </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  components: {
    markdownEditor
  },
  props: ['userNotes', 'mediaid', 'mediaType', 'update'],
  data () {
    return {
      notes: this.userNotes,
      id: this.mediaid,
      type: this.mediaType,
      editorConfigs: {
        spellChecker: true,
        toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image']
      }
    }
  },
  computed: {
    simplemde () {
      return this.$refs.markdownEditor.simplemde
    }
  },
  mounted () {
    this.simplemde.codemirror.on('blur', this.updateNotes)
  },
  watch: {
    userNotes (value) {
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
@import '../statics/simplemde-dark-theme.min.css';

.cm-spell-error {
  background-color: rgba(255,0,0,0.2);
}

</style>
