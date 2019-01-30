<template>
  <div>
    <div class="row gutter-sm">
      <div class="col-12">
        <q-select
          multiple
          v-model="selectedTypes"
          :options="types"
          dark
        />
      </div>
      <div class="col-12">
        <div v-masonry transition-duration="0.3s" item-selector=".media-iteml">
          <!-- <draggable :list="showItems" @change="onMediaDrag" ref="mediaDrag" :options="{ swapThreshold: 0.5, dragClass: 'media-ghost', handle: '.media-drag-handle', group: { name: 'media', pull: 'clone' }, disabled: $q.platform.is.mobile }"> -->
          <q-card inline v-bind:class="[item.type] + 'l'" v-masonry-tile v-for="item in showItems" :key="item.id" class="media-cardl media-iteml" @click.native="openItem(item.media, item.type, $event)">
            <!-- Drag Handle -->
            <!-- <div class="round-borders bg-primary media-drag-handle" v-if="!$q.platform.is.mobile || $q.platform.is.ipad">
              <q-icon name="fas fa-arrows-alt" size="1rem" />
            </div> -->
            <!-- Add button -->
            <!-- <div class="bg-primary add-handle" v-if="!$q.platform.is.mobile || $q.platform.is.ipad" @click.native="addMedia(item.key)" v-bind:class="{ hidden: item.used }">
              <q-icon name="fas fa-plus" size="1rem" />
            </div> -->
            <q-btn class="add-handle" round color="primary" v-if="!$q.platform.is.mobile || $q.platform.is.ipad" @click.native="addMedia(item.key)" v-bind:class="{ hidden: item.used }" icon="fas fa-plus" size=".8rem" />
            <q-card-media v-if="imageTypes.includes(item.type) || titleTypes.includes(item.type)" style="border-radius: 3px;">
              <img :src="item.media.thumbURL" class="image-cardl" />
              <q-card-title slot="overlay" v-if="titleTypes.includes(item.type)">{{ item.media.title }}</q-card-title>
            </q-card-media>
            <q-card-title v-if="textTypes.includes(item.type)">{{ item.media.title }}</q-card-title>
            <q-card-main v-if="textTypes.includes(item.type)">
              <p>| <span v-for="author in item.media.author" :key="author">{{ author }} | </span></p>
            </q-card-main>
            <q-card-main v-if="listTypes.includes(item.type)">
              <p v-if="item.type !== 'outline'">{{ item.media.text }}</p>
              <p v-if="item.type === 'outline'"><span v-for="point in item.media.points" :key="point">{{ point }}</span></p>
              <p class="q-caption text-weight-thin">{{ item.media.media.title }} | {{ item.media.media.author.join(', ') }}</p>
            </q-card-main>
          </q-card>
          <!-- </draggable> -->
        </div>
      </div>
    </div>
    <q-modal v-model="resourceOpen" content-classes="resource-modal">
      <resource-preview :type="resourceType" :resource="resource" />
    </q-modal>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import ResourcePreview from 'components/ResourcePreview.vue'

export default {
  components: {
    Draggable,
    ResourcePreview
  },
  // name: 'ComponentName',
  props: ['items', 'width'],
  data () {
    return {
      showItems: [],
      isImage: this.type === 'images',
      resourceOpen: false,
      resourceType: '',
      resource: '',
      cardStyle: {
        width: this.width
      },
      imageTypes: [ 'book', 'movie', 'image', 'article' ],
      titleTypes: [ 'video', 'article' ],
      textTypes: [ 'document', 'discourse', 'composition', 'note' ],
      listTypes: [ 'quote', 'idea', 'illustration', 'outline' ],
      selectedTypes: [ 'all' ],
      types: [
        {
          label: 'All',
          value: 'all'
        },
        {
          label: 'Book',
          value: 'book'
        },
        {
          label: 'Movie',
          value: 'movie'
        },
        {
          label: 'Image',
          value: 'image'
        },
        {
          label: 'Video',
          value: 'video'
        },
        {
          label: 'Article',
          value: 'article'
        },
        {
          label: 'Note',
          value: 'note'
        },
        {
          label: 'Discourse',
          value: 'discourse'
        },
        {
          label: 'Document',
          value: 'document'
        },
        {
          label: 'Composition',
          value: 'composition'
        },
        {
          label: 'Quote',
          value: 'quote'
        },
        {
          label: 'Outline',
          value: 'outline'
        },
        {
          label: 'Idea',
          value: 'idea'
        },
        {
          label: 'Illustration',
          value: 'illustration'
        }
      ]
    }
  },
  watch: {
    'selectedTypes': function (newVal, oldVal) {
      if (newVal.includes('all')) {
        if (newVal.length > 1) {
          if (oldVal.includes('all')) {
            this.selectedTypes.splice(0, 1)
          } else {
            this.selectedTypes = ['all']
          }
        }
      }
      this.showItems = this.items.filter(this.checkType)
    },
    'items': function (value) {
      this.showItems = value.filter(this.checkType)
    }
  },
  mounted () {
    this.showItems = this.items.filter(this.checkType)
  },
  updated () {
    console.log('updated')
  },
  methods: {
    openItem (item, type, e) {
      // console.log(e.srcElement)
      if (e.srcElement.nodeName !== 'I' && e.srcElement.nodeName !== 'BUTTON' && !e.srcElement.classList.contains('q-btn-inner')) {
        console.log(e)
        console.log(item)
        console.log(type)
        this.resource = item
        this.resourceType = type
        this.resourceOpen = true
      }
    },
    addMedia (id) {
      console.log('add media from MediaList')
      this.$root.$emit('add-topic-media', id)
    },
    checkType (item) {
      if (this.selectedTypes.includes('all')) {
        return true
      } else {
        return this.selectedTypes.includes(item.type)
      }
    },
    loaded (item) {
      if (this.listTypes.includes(item.type)) {
        return item.media && item.media.media && item.media.media.status
      } else {
        return item.media && item.media.status
      }
    },
    onMediaDrag (val, id) {
      console.log('some media dragged', val)
    }
  }
}
</script>

<style>

.media-cardl {
  background-color: var(--q-color-dark);
  border-radius: 3px !important;
  margin: 5px;
  width: 95%;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity .25s;
  transition-timing-function: ease-in;
}

.media-cardl:hover {
  opacity: 1;
}

.resource-modal {
  /* padding: 30px; */
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 800px) {
  .media-cardl {
    width: 31%;
  }
}

@media screen and (min-width: 1200px) {
  .media-cardl {
    width: 95% !important;
  }
  .resource-modal {
    min-width: 650px;
    width: 650px;
  }
}

.media-drag-handle {
  position: absolute;
  height: 60px;
  left: 0px;
  top: 0px;
  padding-top: 20px;
  padding-left: 4px;
  padding-right: 4px;
  opacity: 0.5;
  z-index: 1000;
  cursor: move;
}

.media-drag-handle:hover {
  opacity: .7;
}

.add-handle {
  position: absolute;
  height: 30px;
  width: 30px;
  /* padding-top: 5px;
  padding-left: 8px;
  padding-right: 8px; */
  opacity: 0.7;
  right: -5px;
  top: -5px;
  border-radius: 50px !important;
  z-index: 1000;
  cursor: pointer;
}

.add-handle:hover {
  opacity: .9;
}

.media-ghost {
  width: 20px;
  height: 20px;
}

.media-ghost .media-cardl {
  display: none;
}

</style>
