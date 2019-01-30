<template>
  <div>
    <!-- <q-btn color="primary" label="Refresh" @click.native="init" /> -->
    <q-resize-observable @resize="onResize" />
    <q-spinner color="primary" class="absolute-center" size="3rem" v-if="loading" />
    <media-list :items="resources" :width="size.width/2" v-if="!loading" />
  </div>
</template>

<script>
import MediaList from 'components/MediaList.vue'

// const snippetTypes = ['quote', 'idea', 'illustration', 'outline']

export default {
  components: {
    MediaList
  },
  name: 'TopicResources',
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      // resources: this.$fiery(this.$firebase.view('topic', this.$route.params.id).collection('resources'), {
      //   onSuccess: (res) => {
      //     var resProms = []
      //     res.forEach((resource) => {
      //       resProms.push(this.$firebase.view(resource.type, resource.id).get())
      //     })
      //     Promise.all(resProms).then((docs) => {
      //       var snipProms = []
      //       res.forEach((resource, index) => {
      //         resource.media = docs[index].data()
      //         if (snippetTypes.includes(resource.type)) {
      //           snipProms.push({
      //             prom: this.$firebase.view(resource.media.mediaType, resource.media.mediaid).get(),
      //             index: index
      //           })
      //         }
      //       })
      //       if (snipProms.length > 0) {
      //         Promise.all(snipProms.map(e => { return e.prom })).then((snips) => {
      //           snips.forEach((snipMedia, index) => {
      //             res[snipProms[index].index].media.media = snipMedia.data()
      //           })
      //           this.loading = false
      //         })
      //       } else {
      //         this.loading = false
      //       }
      //     })
      //     console.log('resources loaded')
      //   }
      // }),
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
    async init () {
      this.resources = await this.$firebase.getTopicResources(this.$route.params.id)
      this.loading = false
      this.$root.$on('remove-topic-resource', async () => {
        this.resources = await this.$firebase.getTopicResources(this.$route.params.id)
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
