<template>
  <div>
    <!-- <waterfall :line-gap="width" :min-line-gap="width" :single-max-width="width" :watch="items" align="center">
      <waterfall-slot
        v-for="item in items"
        :width="width"
        :height="300"
        :key="item.media._id"
      > -->
    <q-btn label="Pack" color="primary" @click.native="pack" />
    <bricks
      ref="bricks"
      :data="items"
      :sizes="sizes"
    >
      <template slot-scope="scope">
        <q-card color="primary" inline v-bind:class="[scope.item.type] + 'l'" class="media-cardl" @click="openItem(scope.item.media._id)">
          <q-card-media v-if="scope.item.type == 'book' || scope.item.type == 'movie' || scope.item.type == 'video' || scope.item.type == 'article' || scope.item.type == 'image'">
            <img :src="scope.item.media.thumbURL" />
          </q-card-media>
          <q-card-title v-if="scope.item.type == 'book' || scope.item.type == 'movie' || scope.item.type == 'video' || scope.item.type == 'article' || scope.item.type == 'discourse' || scope.item.type == 'note'">
              {{ scope.item.media.title }}
              <span v-if="scope.item.type == 'book' || scope.item.type == 'movie' || scope.item.type == 'video' || scope.item.type == 'article' || scope.item.type == 'discourse'" v-for="author in scope.item.media.author" :key="author" slot="subtitle">{{ author }}</span>
              <span v-if="scope.item.type == 'note'" slot="subtitle">{{ scope.item.media.text }}</span>
            </q-card-title>
            <q-card-main v-if="scope.item.type == 'quote'">
              <p>{{ scope.item.media.text }}</p>
              <p class="q-body-2"><span v-for="author in scope.item.media.mediaid.author" :key="author">{{ author }} | </span>{{ scope.item.media.mediaid.title }}</p>
            </q-card-main>
        </q-card>
      </template>
    </bricks>
      <!-- </waterfall-slot>
    </waterfall> -->
    <q-modal v-model="resourceOpen">
      <resource-preview :type="resourceType" :id="resourceID" />
    </q-modal>
  </div>
</template>

<script>
// import Waterfall from 'vue-waterfall/lib/waterfall'
// import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
import Bricks from 'vue-bricks'
import ResourcePreview from 'components/ResourcePreview.vue'

export default {
  components: {
    // Waterfall,
    // WaterfallSlot,
    Bricks,
    ResourcePreview
  },
  // name: 'ComponentName',
  props: ['items', 'width'],
  data () {
    return {
      isImage: this.type === 'images',
      resourceOpen: false,
      resourceType: '',
      resourceID: '',
      sizes: [
        { columns: 1, gutter: 20 },
        { mq: '800px', columns: 2, gutter: 20 },
        { mq: '1000px', columns: 3, gutter: 20 },
        { mq: '1200px', columns: 2, gutter: 20 }
      ],
      cardStyle: {
        width: this.width
      }
    }
  },
  watch: {
    'items': function () {
      this.pack()
    },
    'width': function () {
      this.pack()
    }
  },
  updated () {
    console.log('updated')
    console.log(this.$refs.bricks)
    this.pack()
  },
  methods: {
    openItem (id, type) {
      console.log(id)
      console.log(type)
      switch (type) {
        case 'book':
          // this.$router.push({ name: 'book', params: { id: id } })
          break
        case 'movie':
          // this.$router.push({ name: 'movie', params: { id: id } })
          break
        case 'article':
          // this.$router.push({ name: 'article', params: { id: id } })
          break
        case 'video':
          // this.$router.push({ name: 'video', params: { id: id } })
          break
        case 'image':
          // this.$router.push({ name: 'image', params: { id: id } })
          break
        case 'note':
          // this.$router.push({ name: 'note', params: { id: id } })
          break
        case 'quote':
          // this.$router.push({ name: 'note', params: { id: id } })
          break
        default:
          console.error('Incorrect item type for routing')
          break
      }
    },
    pack () {
      this.$refs.bricks.pack()
    }
  }
}
</script>

<style>

.media-cardl {
  /* margin: 10px; */
  /* width: 100%; */
  cursor: pointer;
}

.image-cardl {
  opacity: 0.5;
  transition: opacity .25s;
  transition-timing-function: ease-in;
}

.image-cardl:hover {
  opacity: 1;
}

@media screen and (min-width: 800px) {
  .bookl, .moviel, .imagel, .videol, .articlel, .notel, .quotel {
    width: 300px;
  }
}

@media screen and (min-width: 1200px) {
  .bookl, .moviel, .imagel, .videol, .articlel, .notel, .quotel {
    width: 200px;
  }
}

@media screen and (min-width: 1500px) {
  .bookl, .moviel, .imagel, .videol, .articlel, .notel, .quotel {
    width: 250px;
  }
}

</style>
