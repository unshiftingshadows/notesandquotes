<template>
  <q-item>
    <q-item-main>
      <p><b>{{ illustration.title }}</b></p>
      <p>{{ illustration.text }}</p>
      <q-item-tile sublabel lines="3" v-if="illustration.notes !== '' && showNotes">{{ illustration.notes }}</q-item-tile>
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
      <span v-if="showLocation && illustration.locationType !== 'None'" class="q-item-sublabel">
        {{ illustration.locationType }} {{ illustration.location }}&nbsp;
      </span>
      <span v-if="showTags">
        <q-chip v-for="tag in illustration.tags" small color="primary" :key="tag">{{ tag }}</q-chip>
      </span>
      <span v-if="showTags && showBible && illustration.tags.length !== 0 && illustration.bibleRefs.length !== 0">
         |
      </span>
      <span v-if="showBible">
        <q-chip v-for="bibleRef in illustration.bibleRefs" small color="secondary" :key="bibleRef._id">{{ $bible.readable(bibleRef) }}</q-chip>
      </span>
    </q-item-main>
    <q-item-side right v-if="showCover" style="margin: 20px">
      <q-item-tile v-if="showCover" image>
        <img :src="illustration.mediaImageURL" class="cover-image" />
      </q-item-tile>
      <q-item-tile sublabel lines="1" v-if="showAuthor">{{ illustration.author }}</q-item-tile>
    </q-item-side>
    <q-modal v-model="editOpen" content-classes="edit-illustration-modal">
      <q-icon name="fas fa-times" size="2rem" @click.native="editOpen=false" class="float-right cursor-pointer" />
      <illustration-form ref="illustrationForm" :illustration="illustration" :modal-fin="closeEdit" form-type="Edit" />
    </q-modal>
  </q-item>
</template>

<script>
import IllustrationForm from 'components/IllustrationForm.vue'

export default {
  components: {
    IllustrationForm
  },
  props: ['illustrationObj', 'cover', 'author', 'location', 'tags', 'bible', 'notes'],
  data () {
    return {
      showCover: (this.cover === ''),
      showAuthor: (this.author === ''),
      showLocation: (this.location === ''),
      showTags: (this.tags === ''),
      showBible: (this.bible === ''),
      showNotes: (this.notes === ''),
      editOpen: false,
      illustration: this.illustrationObj,
      addState: this.$selectedTopic.get() && !this.$selectedTopic.find(this.illustrationObj._id) ? 'n' : 'y'
    }
  },
  watch: {
    illustrationObj (value) {
      this.illustration = value
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
      this.$refs.illustrationForm.init(false)
    },
    closeEdit (value) {
      // this.illustration = value
      this.editOpen = false
    },
    topicAdd () {
      var obj = {
        id: this.illustration._id,
        type: 'illustration'
      }
      this.$selectedTopic.add(obj).then((ans) => {
        this.addState = ans ? 'y' : 'n'
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
.edit-illustration-modal {
  padding: 30px;
  width: 100%;
}
@media screen and (min-width: 1200px) {
  .edit-illustration-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
