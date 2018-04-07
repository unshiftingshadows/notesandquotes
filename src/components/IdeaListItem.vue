<template>
  <q-item>
    <q-item-main>
      <p>{{ idea.text }}</p>
      <q-item-tile sublabel lines="3" v-if="idea.notes !== '' && showNotes">{{ idea.notes }}</q-item-tile>
      <br/>
      <span v-if="this.$selectedTopic.get()">
        <span v-if="showTopicAdd()">
          <q-chip icon="fa-plus" @click.native="topicAdd" class="cursor-pointer" color="primary" small>Add</q-chip>&nbsp;
        </span>
        <span v-if="!showTopicAdd()">
          <q-chip icon="fa-check" @click.native="topicAdd" color="positive" small>Added!</q-chip>&nbsp;
        </span>
      </span>
      <span>
        <q-icon name="fa-pencil" @click.native="openEdit" class="cursor-pointer" />&nbsp;
      </span>
      <span v-if="showLocation && idea.locationType !== 'None'" class="q-item-sublabel">
        {{ idea.locationType }} {{ idea.location }}&nbsp;
      </span>
      <span v-if="showTags">
        <q-chip v-for="tag in idea.tags" small color="primary" :key="tag">{{ tag }}</q-chip>
      </span>
      <span v-if="showTags && showBible && idea.tags.length !== 0 && idea.bibleRefs.length !== 0">
         |
      </span>
      <span v-if="showBible">
        <q-chip v-for="bibleRef in idea.bibleRefs" small color="secondary" :key="bibleRef._id">{{ refString(bibleRef) }}</q-chip>
      </span>
    </q-item-main>
    <q-item-side right v-if="showCover" style="margin: 20px">
      <q-item-tile v-if="showCover" image>
        <img :src="idea.mediaImageURL" class="cover-image" />
      </q-item-tile>
      <q-item-tile sublabel lines="1" v-if="showAuthor">{{ idea.author }}</q-item-tile>
    </q-item-side>
    <q-modal v-model="editOpen" content-classes="edit-idea-modal">
      <q-icon name="fa-close" size="2rem" @click.native="editOpen=false" class="float-right cursor-pointer" />
      <idea-form ref="ideaForm" :idea="idea" :modal-fin="closeEdit" form-type="Edit" />
    </q-modal>
  </q-item>
</template>

<script>
import IdeaForm from 'components/IdeaForm.vue'

export default {
  components: {
    IdeaForm
  },
  props: ['ideaObj', 'cover', 'author', 'location', 'tags', 'bible', 'notes'],
  data () {
    return {
      showCover: (this.cover === ''),
      showAuthor: (this.author === ''),
      showLocation: (this.location === ''),
      showTags: (this.tags === ''),
      showBible: (this.bible === ''),
      showNotes: (this.notes === ''),
      editOpen: false,
      idea: this.ideaObj
    }
  },
  watch: {
    idea (value) {
      this.idea = value
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
      this.$refs.ideaForm.init(false)
    },
    closeEdit (value) {
      this.idea = value
      this.editOpen = false
    },
    showTopicAdd () {
      return this.$selectedTopic.get() && !this.$selectedTopic.find(this.idea._id)
    },
    topicAdd () {
      var obj = {
        topic: this.$selectedTopic.get().id,
        media: this.idea._id,
        type: 'idea'
      }
      this.database.add('resource', obj, (res) => {
        this.$selectedTopic.add(this.idea._id)
      })
    }
  }
}
</script>

<style>

.q-item-image {
  margin-left: 20px;
}
.q-item-image img {
  max-width: 50%;
  max-height: 50%;
}
.edit-idea-modal {
  padding: 30px;
  width: 100%;
}
@media screen and (min-width: 1200px) {
  .edit-idea-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
