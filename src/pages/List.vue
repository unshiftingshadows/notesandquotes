<template>
  <q-page padding>
    <q-toggle v-if="readTypes.includes(type)" v-model="showOnlyNew" label="Show New" class="float-right" />
    <h3>{{ type }}&nbsp;
      <q-btn v-if="type === 'topic'" size="sm" icon="fas fa-plus" color="primary" @click.native="openAddTopic" />
    </h3>
    <div v-if="loading">
      <q-spinner color="primary" class="absolute-center" size="3em" />
    </div>
    <div v-if="!loading">
      <div v-masonry :transition-duration="0" item-selector=".media-item">
        <q-card inline v-masonry-tile v-for="item in items" :key="item._id" v-bind:class="[ type, { 'image-card': imageTypes.includes(type) }]" class="media-card media-item" @click.native="openItem(item._id, item)">
          <q-card-media v-if="imageTypes.includes(type)">
            <img :src="item.thumbURL" />
            <q-card-title slot="overlay" v-if="type !== 'book' && type !== 'movie' && type !== 'image'">
              <span v-if="!noTitleTypes.includes(type)">{{ item.title }}</span>
              <span slot="subtitle" v-if="item.userData && item.userData[firebase.auth.currentUser.uid]"><q-chip v-for="tag in item.userData[firebase.auth.currentUser.uid].tags" :key="tag" color="primary" small style="margin-right: 5px; margin-bottom: 5px;">{{ tag }}</q-chip></span>
            </q-card-title>
          </q-card-media>
          <span v-if="type === 'composition'" class="float-right text-weight-thin" style="margin-top: 5px; margin-right: 5px;">{{ capText(item.type) }}</span>
          <q-card-title v-if="textTypes.includes(type)">{{ item.title }}</q-card-title>
          <q-card-main v-if="textTypes.includes(type)">
            <p>| <span v-for="author in item.author" :key="author">{{ author }} | </span></p>
            <p v-if="item.userData && item.userData[firebase.auth.currentUser.uid]"><q-chip v-for="tag in item.userData[firebase.auth.currentUser.uid].tags" :key="tag" color="primary" small style="margin-right: 5px;">{{ tag }}</q-chip></p>
          </q-card-main>
        </q-card>
      </div>
      <q-list v-if="listTypes.includes(type)">
        <q-item v-for="item in items" :key="item._id" link @click.native="openItem(item._id)">
          <q-item-main>
            <q-item-tile label>{{ item.title }}</q-item-tile>
            <q-item-tile sublabel v-if="type === 'note'">{{ item.text }}</q-item-tile>
            <q-item-tile sublabel v-if="type ==='discourse'"><span v-for="author in item.author" :key="author">{{ author }}</span></q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
      <q-btn label="Load More..." color="primary" @click.native="loadMore()" :disabled="end" />
      <q-spinner v-if="loadingMore" color="primary" size="3rem" />
    </div>
    <q-modal ref="addModal" v-model="showTopic" content-classes="add-media-modal">
      <add-research :modal-fin="closeAddTopic" ref="addTopic" />
    </q-modal>
  </q-page>
</template>

<script>
import AddResearch from 'components/AddResearch.vue'
import { format } from 'quasar'

const { capitalize } = format

export default {
  components: {
    AddResearch
  },
  name: 'List',
  fiery: true,
  data () {
    return {
      type: this.$route.params.type,
      allItems: this.$fiery(this.$firebase.list(this.$route.params.type), {
        query: (list) => list.where('users', 'array-contains', this.$firebase.auth.currentUser.uid).orderBy('dateAdded', 'desc'),
        stream: true,
        streamInitial: 12,
        streamMore: 12,
        key: '_id',
        exclude: ['_id'],
        onSuccess: (list) => {
          console.log('done loading', list.length)
          this.loading = false
        }
      }),
      isImage: this.$route.params.type === 'image',
      showTopic: false,
      loading: true,
      loadingMore: false,
      end: false,
      sizes: [
        { columns: 1, gutter: 10 },
        { mq: '800px', columns: 2, gutter: 20 },
        { mq: '1400px', columns: 3, gutter: 20 },
        { mq: '1800px', columns: 4, gutter: 20 }
      ],
      imageTypes: [ 'book', 'movie', 'image', 'article', 'video' ],
      noTitleTypes: [ 'book', 'movie', 'image' ],
      textTypes: [ 'document', 'discourse', 'composition' ],
      listTypes: [ 'note', 'topic' ],
      readTypes: [ 'book', 'movie', 'article', 'video', 'discourse', 'composition' ],
      showOnlyNew: false,
      limit: 10
    }
  },
  mounted () {
    // this.init(this.$route.params.type)
    // console.log(window.location)
  },
  watch: {
    '$route.params.type' (newType, oldType) {
      this.type = newType
      this.loading = true
      // this.init(newType)
      console.log(newType)
      this.$fiery.free(this.allItems)
      this.allItems = this.$fiery(this.$firebase.list(this.$route.params.type), {
        query: (list) => list.where('users', 'array-contains', this.$firebase.auth.currentUser.uid).orderBy('dateAdded', 'desc'),
        stream: true,
        streamInitial: 12,
        streamMore: 12,
        key: '_id',
        exclude: ['_id'],
        onSuccess: (list) => {
          console.log('done loading', list.length)
          this.loading = false
        }
      })
    }
    // 'showOnlyNew' (newState) {
    //   // this.dbCall(this.type)
    // }
  },
  computed: {
    // itemsOptions: function () {
    //   const { limit } = this
    //   var initQuery = items => items.where('users', 'array-contains', this.$firebase.auth.currentUser.uid).orderBy('dateAdded').limit(limit)
    //   if (this.showOnlyNew) {
    //     initQuery = initQuery.where('status', '==', 'new')
    //   }
    //   return {
    //     query: initQuery,
    //     queryReverse: items => items.where('users', 'array-contains', this.$firebase.auth.currentUser.uid).orderBy('dateAdded', 'desc').limit(limit),
    //     key: '_id',
    //     exclude: ['_id'],
    //     onSuccess: () => {
    //       console.log('redraw?')
    //       this.$redrawVueMasonry()
    //       this.$forceUpdate()
    //     }
    //   }
    // },
    // items: function () {
    //   return this.$fiery(this.$firebase.list(this.$route.params.type), this.itemsOptions, 'allItems')
    // },
    items: function () {
      return this.allItems.filter((val) => { return this.showOnlyNew ? val.status === 'new' : true })
    }
    // itemsPager: function () {
    //   return this.$fiery.pager(this.items)
    // }
  },
  methods: {
    init (type) {
      // this.showOnlyNew = false
      // this.dbCall(type)
    },
    openItem (id) {
      console.log(id)
      console.log(this.type)
      if (id === undefined) {
        console.log('undefined...')
        return
      }
      this.$router.push({ name: this.type, params: { id: id } })
    },
    openAddTopic () {
      console.log(this.$refs)
      this.showTopic = true
      this.$refs.addTopic.reset()
    },
    closeAddTopic () {
      this.showTopic = false
    },
    capText (text) {
      return capitalize(text)
    },
    async loadMore (index, done) {
      if (this.end) return
      this.loadingMore = true
      try {
        await this.$fiery.more(this.allItems)
        this.loadingMore = false
      } catch (err) {
        this.end = true
        this.loadingMore = false
      }
    }
  }
}
</script>

<style>

.media-card {
  background-color: var(--q-color-dark);
  margin: 10px;
  width: 95%;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity .25s;
  transition-timing-function: ease-in;
}

.media-card:hover {
  opacity: 1;
}

.add-media-modal {
  padding: 30px;
  width: 100%;
}

.book, .movie {
  margin: 1%;
  width: 48%;
}

.image {
  width: 95%;
}

@media screen and (min-width: 800px) {
  .media-card {
    width: 47%;
  }
}

@media screen and (min-width: 1200px) {
  .media-card {
    width: 30%;
  }
  .add-media-modal {
    min-width: 500px;
    width: 500px;
  }
}

@media screen and (min-width: 1400px) {
  .book {
    width: 23%;
  }
}

@media screen and (min-width: 1600px) {
  .book {
    width: 18%;
  }
}

</style>
