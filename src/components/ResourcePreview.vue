<template>
  <div class="row gutter-sm resource-preview">
    <div class="col-xs-12 col-md-4">
      <img v-if="type !== 'note' && type !== 'document'" :src="media.thumbURL" style="width: 100%;" />
    </div>
    <div class="col-xs-12 col-md-8">
      <h4>{{ media.title }}</h4>
      <p><span v-for="author in media.author" :key="author">{{ author }}</span></p>
      <div>
        <q-chip v-for="tag in media.allTags" :key="tag" color="primary">{{ tag }}</q-chip>
      </div>
    </div>
    <div class="col-12" v-if="type === 'book' || type === 'movie'">
      <quote-list :mediaid="media._id" :media="media" :media-type="type" modal></quote-list>
    </div>
  </div>
</template>

<script>
import QuoteList from 'components/QuoteList.vue'

export default {
  components: {
    QuoteList
  },
  // name: 'ComponentName',
  props: ['resource', 'type'],
  data () {
    return {
      media: {
        _id: '',
        imageURL: '',
        title: ''
      }
    }
  },
  watch: {
    'resource': function (value) {
      this.media = value
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.media = this.resource
    }
  }
}
</script>

<style>

.resource-preview {
  padding: 20px;
}

</style>
