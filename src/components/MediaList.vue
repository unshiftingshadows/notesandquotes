<template>
  <div style="padding: 5px; position: relative;">
    <div class="sticky-bar">
      <q-toolbar color="secondary" style="z-index: 10;">
        <!-- <q-select
          multiple
          v-model="selectedTypes"
          :options="types"
          dark
        /> -->
        <q-btn icon="fas fa-filter" label="Filter">
          <q-popover>
            <div class="row" style="padding: 10px;">
              <div class="col-12">
                <q-checkbox v-model="selectedTypes" val="all" label="All" />
              </div>
              <div class="col-6">
                <q-checkbox v-model="selectedTypes" val="book" label="Book" /><br/>
                <q-checkbox v-model="selectedTypes" val="movie" label="Movie" /><br/>
                <q-checkbox v-model="selectedTypes" val="image" label="Image" /><br/>
                <q-checkbox v-model="selectedTypes" val="video" label="Video" /><br/>
                <q-checkbox v-model="selectedTypes" val="article" label="Article" /><br/>
                <q-checkbox v-model="selectedTypes" val="document" label="Document" /><br/>
                <q-checkbox v-model="selectedTypes" val="discourse" label="Discourse" /><br/>
                <q-checkbox v-model="selectedTypes" val="composition" label="Composition" /><br/>
                <q-checkbox v-model="selectedTypes" val="note" label="Note" />
              </div>
              <div class="col-6">
                <q-checkbox v-model="selectedTypes" val="quote" label="Quote" /><br/>
                <q-checkbox v-model="selectedTypes" val="idea" label="Idea" /><br/>
                <q-checkbox v-model="selectedTypes" val="illustration" label="Illustration" /><br/>
                <q-checkbox v-model="selectedTypes" val="outline" label="Outline" />
              </div>
            </div>
          </q-popover>
        </q-btn>
        <q-btn icon="fas fa-sort" label="Sort" class="on-right">
          <q-popover @hide="redrawMasonry">
            <div class="row" style="padding: 10px; min-width: 250px;">
              <div class="col-6">
                <q-radio v-model="sortType" val="title" label="Title" /><br/>
                <q-radio v-model="sortType" val="dateAdded" label="Date" />
              </div>
              <div class="col-6">
                <q-radio v-model="sortDirection" val="asc" label="Ascending" /><br/>
                <q-radio v-model="sortDirection" val="desc" label="Descending" />
              </div>
            </div>
          </q-popover>
        </q-btn>
      </q-toolbar>
    </div>
    <div class="row gutter-sm" style="z-index: 1;">
      <div class="col-12">
        <q-scroll-area style="width: 100%; height: 100vh;">
          <div v-masonry transition-duration="0.3s" item-selector=".media-iteml" ref="masonry">
            <q-card inline v-bind:class="[item.type] + 'l'" v-masonry-tile v-for="item in showItems" :key="item.id" class="media-cardl media-iteml" @click.native="openItem(item.media, item.type, $event)">
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
                <ol v-if="item.type === 'outline' && item.media.numbered" style="padding-left: 10px;">
                  <li v-for="point in item.media.points" :key="point" style="padding-top: 5px;">
                    {{ point.split('%%')[0] }}<br/><span class="q-caption">{{ point.split('%%')[1] }}</span>
                  </li>
                </ol>
                <ol v-if="item.type === 'outline' && !item.media.numbered" style="padding-left: 10px;">
                  <li v-for="point in item.media.points" :key="point" style="padding-top: 5px;">
                    {{ point.split('%%')[0] }}<br/><span class="q-caption">{{ point.split('%%')[1] }}</span>
                  </li>
                </ol>
                <p class="q-caption text-weight-thin">{{ item.media.media.title }} | {{ item.media.media.author.join(', ') }}</p>
                <div v-if="item.media.notes">
                  <blockquote class="q-caption">{{ item.media.notes }}</blockquote>
                </div>
              </q-card-main>
            </q-card>
          </div>
        </q-scroll-area>
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
  name: 'MediaList',
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
      sortType: 'title',
      sortDirection: 'asc',
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
      this.sortFilter()
    },
    'sortType': function (newVal, oldVal) {
      this.sortFilter()
    },
    'sortDirection': function (newVal, oldVal) {
      this.sortFilter()
    },
    'items': function (value) {
      this.showItems = value.filter(this.checkType)
    }
  },
  mounted () {
    this.sortFilter()
  },
  methods: {
    openItem (item, type, e) {
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
    onMediaDrag (val, id) {
      console.log('some media dragged', val)
    },
    sortFilter () {
      this.showItems = this.items.filter(this.checkType).sort((a, b) => {
        var valA, valB
        if (this.sortType === 'title') {
          valA = this.$types.SNIPPET.includes(a.type) ? a.media.media.title.toUpperCase() : a.media.title.toUpperCase()
          valB = this.$types.SNIPPET.includes(b.type) ? b.media.media.title.toUpperCase() : b.media.title.toUpperCase()
        } else if (this.sortType === 'dateAdded') {
          valA = a.dateAdded
          valB = b.dateAdded
        }
        var comparisonA = 0
        if (valA > valB) {
          comparisonA = 1
        } else if (valA < valB) {
          comparisonA = -1
        }
        var comparisonB = 0
        if (a.type.toUpperCase() > b.type.toUpperCase()) {
          comparisonB = 1
        } else if (a.type.toUpperCase() < b.type.toUpperCase()) {
          comparisonB = -1
        }
        return (this.sortDirection === 'asc' ? comparisonA : (comparisonA * -1)) || comparisonB
      })
    },
    redrawMasonry () {
      this.$redrawVueMasonry()
    }
  }
}
</script>

<style>

.sticky-bar {
  width: 100%;
  z-index: 10;
}

.media-cardl {
  background-color: var(--q-color-dark);
  border-radius: 3px !important;
  margin: 5px;
  width: 31%;
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
    width: 31% !important;
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
