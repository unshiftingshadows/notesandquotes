<template>
  <div>
    <q-checkbox v-model="checkBook" label="Books" />
    <q-checkbox v-model="checkMovie" label="Movies" />
    <q-checkbox v-model="checkImage" label="Images" />
    <q-checkbox v-model="checkVideo" label="Videos" />
    <q-checkbox v-model="checkArticle" label="Articles" />
    <q-checkbox v-model="checkNote" label="Notes" />
    <q-checkbox v-model="checkQuote" label="Quotes" />
    <div v-if="checkBook">
      <media-list type="books" :terms="tags" search="tag"></media-list>
    </div>
    <div v-if="checkMovie">
      <media-list type="movies" :terms="tags" search="tag"></media-list>
    </div>
    <div v-if="checkImage">
      <media-list type="images" :terms="tags" search="tag"></media-list>
    </div>
    <div v-if="checkVideo">
      <media-list type="videos" :terms="tags" search="tag"></media-list>
    </div>
    <div v-if="checkArticle">
      <media-list type="articles" :terms="tags" search="tag"></media-list>
    </div>
    <div v-if="checkNote">
      <media-list type="notes" :terms="tags" search="tag"></media-list>
    </div>
    <div v-if="checkQuote">
      <media-list type="quotes" :terms="tags" search="tag"></media-list>
    </div>
  </div>
</template>

<script>
import MediaList from 'components/MediaList.vue'

export default {
  components: {
    MediaList
  },
  // name: 'ComponentName',
  data () {
    return {
      checkBook: false,
      checkMovie: false,
      checkImage: false,
      checkVideo: false,
      checkArticle: false,
      checkNote: false,
      checkQuote: true
    }
  }
}
</script>

<style>
</style>
