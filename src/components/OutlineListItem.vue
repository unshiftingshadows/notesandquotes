<template>
  <q-card inline class="outline-card">
    <q-card-title>{{ outline.title }}</q-card-title>
    <q-card-main>
      <ol v-if="outline.numbered">
        <li v-for="(point, index) in outline.points" :key="index">
          {{ point.split('%%')[0] }}<br/><span class="q-caption">{{ point.split('%%')[1] }}</span>
        </li>
      </ol>
      <ul v-if="!outline.numbered">
        <li v-for="(point, index) in outline.points" :key="index">
          {{ point.split('%%')[0] }}<br/><span class="q-caption">{{ point.split('%%')[1] }}</span>
        </li>
      </ul>
      <q-item-tile sublabel lines="3" v-if="outline.notes !== '' && showNotes">{{ outline.notes }}</q-item-tile>
      <br/>
      <span v-if="this.$selectedTopic.get()">
        <span v-if="addState === 'n'">
          <q-chip icon="fas fa-plus" @click.native="topicAdd" class="cursor-pointer" color="primary" small>Add</q-chip>&nbsp;
        </span>
        <span v-if="addState === 'd'">
          <q-chip icon="fas fa-plus" color="dark" small>Add</q-chip>&nbsp;
        </span>
        <span v-if="addState === 'y'">
          <q-chip icon="fas fa-check" color="positive" small>Added!</q-chip>&nbsp;
        </span>
      </span>
      <span>
        <q-icon name="fas fa-edit" @click.native="openEdit" class="cursor-pointer" />&nbsp;
      </span>
      <span v-if="showLocation && outline.locationType !== 'None'" class="q-item-sublabel">
        {{ outline.locationType }} {{ outline.location.start }}&nbsp; - &nbsp; {{ outline.location.end }}
      </span>
      <span v-if="showTags">
        <q-chip v-for="tag in outline.tags" small color="primary" :key="tag">{{ tag }}</q-chip>
      </span>
      <span v-if="showTags && showBible && outline.tags.length !== 0 && outline.bibleRefs.length !== 0">
         |
      </span>
      <span v-if="showBible">
        <q-chip v-for="bibleRef in outline.bibleRefs" small color="secondary" :key="bibleRef._id">{{ $bible.readable(bibleRef) }}</q-chip>
      </span>
    </q-card-main>
    <q-modal v-model="editOpen" content-classes="edit-outline-modal">
      <q-icon name="fas fa-times" size="2rem" @click.native="editOpen=false" class="float-right cursor-pointer" />
      <outline-form ref="outlineForm" :outline.sync="outline" :modal-fin="closeEdit" form-type="Edit" />
    </q-modal>
  </q-card>
</template>

<script>
import OutlineForm from 'components/OutlineForm.vue'

export default {
  components: {
    OutlineForm
  },
  props: ['outlineObj', 'cover', 'author', 'location', 'tags', 'bible', 'notes'],
  data () {
    return {
      showCover: (this.cover === ''),
      showAuthor: (this.author === ''),
      showLocation: (this.location === ''),
      showTags: (this.tags === ''),
      showBible: (this.bible === ''),
      showNotes: (this.notes === ''),
      editOpen: false,
      outline: this.outlineObj,
      addState: this.$selectedTopic.get() && !this.$selectedTopic.find(this.outlineObj._id) ? 'n' : 'y'
    }
  },
  watch: {
    outlineObj (value) {
      this.outline = value
    }
  },
  methods: {
    refString (ref) {
      if (ref.type === 'single') {
        return ref.book + ' ' + ref.chapter + ':' + ref.verse
      } else if (ref.type === 'simpleRange') {
        return ref.book + ' ' + ref.chapter + ':' + ref.verse + '-' + ref.verser
      } else if (ref.type === 'complexRange') {
        return ref.book + ' ' + ref.chapter + ':' + ref.verse + '-' + ref.chapterr + ':' + ref.verser
      } else {
        console.error('Something went wrong with a Bible Ref...')
      }
    },
    openEdit () {
      this.editOpen = true
      this.$refs.outlineForm.init(false)
    },
    closeEdit (value) {
      console.log('fin', value)
      this.outline = value
      this.editOpen = false
    },
    topicAdd () {
      var obj = {
        id: this.outline._id,
        type: 'outline'
      }
      this.$selectedTopic.add(obj).then((ans) => {
        this.addState = ans ? 'y' : 'n'
      })
    }
  }
}
</script>

<style>

.edit-outline-modal {
  padding: 30px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .edit-outline-modal {
    min-width: 500px;
    width: 500px;
  }
}

.outline-card {
  width: 280px;
}

</style>
