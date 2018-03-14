<template>
  <div>
    <q-btn color="primary" label="Refresh" @click.native="init" />
    <!-- <q-list no-border>
      <q-collapsible label="Books">
        <media-list :items="resType('book')" type="books" />
      </q-collapsible>
      <q-collapsible label="Movies">
        <media-list :items="resType('movie')" type="movies" />
      </q-collapsible>
      <q-collapsible label="Images">
        <media-list :items="resType('image')" type="images" />
      </q-collapsible>
      <q-collapsible label="Videos">
        <media-list :items="resType('video')" type="videos" />
      </q-collapsible>
      <q-collapsible label="Articles">
        <media-list :items="resType('article')" type="articles" />
      </q-collapsible>
      <q-collapsible label="Notes">
        <media-list :items="resType('note')" type="notes" />
      </q-collapsible>
      <q-collapsible label="Quotes">
        <media-list :items="resType('quote')" type="quotes" />
      </q-collapsible>
    </q-list> -->
    <q-resize-observable @resize="onResize" />
    <media-list :items="resources" :width="size.width/2" />
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
      id: this.$route.params.id,
      resources: [],
      size: {
        width: 0,
        height: 0
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.database.resources('topic', this.id, (res) => {
        this.resources = res
      })
    },
    resType (type) {
      var items = []
      this.resources.forEach(item => {
        if (item.type === type) {
          items.push(item.media)
        }
      })
      return items
    },
    onResize (size) {
      this.size = size
    }
  }
}
</script>

<style>
</style>
