<template>
  <q-page padding>
    <h3>{{ type }} <q-btn v-if="type == 'topics'" size="sm" icon="fa-plus" color="primary" @click.native="openAddTopic" /></h3>
    <div v-if="loading">
      <q-spinner color="primary" class="absolute-center" size="3rem" />
    </div>
    <div v-if="!loading">
      <q-card inline v-if="cardTypes.includes(type)" v-for="item in items" :key="item._id" v-bind:class="[type]" class="media-card" @click.native="openItem(item._id)">
        <q-card-media>
          <img :src="item.thumbURL" :class="{ 'image-card': isImage }" />
          <q-card-title slot="overlay" v-if="type == 'books' || type == 'movies' || type == 'videos' || type == 'articles'">
            {{ item.title }}
            <span v-for="author in item.author" :key="author.fullName" slot="subtitle">{{ author.fullName }}</span>
            <!-- <q-icon slot="right" name="fa-ellipsis-v" color="white">
              <q-popover ref="popover">
                <q-list link class="no-border">
                  <q-item @click.native="openItem(item._id)">
                    <q-item-main label="Details" />
                  </q-item>
                </q-list>
              </q-popover>
            </q-icon> -->
          </q-card-title>
        </q-card-media>
      </q-card>
      <bricks
        ref="bricks"
        :data="items"
        :sizes="sizes"
        v-if="brickTypes.includes(type)"
      >
        <template slot-scope="scope">
          <q-card inline v-bind:class="[type]" @click.native="openItem(scope.item._id)">
            <q-card-media>
              <img :src="scope.item.thumbURL" class="image-card" />
            </q-card-media>
          </q-card>
        </template>
      </bricks>
      <q-list v-if="listTypes.includes(type)">
        <q-item v-for="item in items" :key="item._id" link @click.native="openItem(item._id)">
          <q-item-main>
            <q-item-tile label>{{ item.title }}</q-item-tile>
            <q-item-tile sublabel v-if="type === 'notes'">{{ item.text }}</q-item-tile>
            <q-item-tile sublabel v-if="type === 'compositions' || type ==='discourses'"><span v-for="author in item.author" :key="author">{{ author }}</span></q-item-tile>
          </q-item-main>
          <q-item-side right v-if="type === 'compositions'">
            <q-item-tile stamp>{{ item.type }}</q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
    <q-modal ref="addModal" v-model="showTopic" content-classes="add-media-modal">
      <!-- <q-icon name="fa-close" size="2rem" @click.native="closeAddModal" class="float-right cursor-pointer" /> -->
      <add-research :modal-fin="closeAddTopic" ref="addTopic" />
    </q-modal>
  </q-page>
</template>

<script>
import Bricks from 'vue-bricks'
import AddResearch from 'components/AddResearch.vue'

export default {
  components: {
    Bricks,
    AddResearch
  },
  data () {
    return {
      type: this.$route.params.type,
      items: [],
      isImage: this.$route.params.type === 'images',
      showTopic: false,
      loading: false,
      sizes: [
        { columns: 1, gutter: 10 },
        { mq: '800px', columns: 2, gutter: 20 },
        { mq: '1400px', columns: 3, gutter: 20 },
        { mq: '1800px', columns: 4, gutter: 20 }
      ],
      cardTypes: [ 'books', 'movies', 'videos', 'articles' ],
      brickTypes: [ 'images' ],
      listTypes: [ 'notes', 'documents', 'discourses', 'compositions', 'topics' ]
    }
  },
  // firestore () {
  //   return {
  //     items: this.firebase.store.collection(this.$route.params.type)
  //   }
  // },
  mounted () {
    this.init(this.$route.params.type)
  },
  watch: {
    '$route.params.type' (newType, oldType) {
      this.type = newType
      this.init(newType)
    }
  },
  methods: {
    init (type) {
      this.loading = true
      this.database.list(type, (data) => {
        console.log('data', data, this)
        this.items = data
        this.loading = false
      })
    },
    openItem (id) {
      console.log(id)
      console.log(this.type)
      switch (this.type) {
        case 'books':
          this.$router.push({ name: 'book', params: { id: id } })
          break
        case 'movies':
          this.$router.push({ name: 'movie', params: { id: id } })
          break
        case 'articles':
          this.$router.push({ name: 'article', params: { id: id } })
          break
        case 'videos':
          this.$router.push({ name: 'video', params: { id: id } })
          break
        case 'images':
          this.$router.push({ name: 'image', params: { id: id } })
          break
        case 'notes':
          this.$router.push({ name: 'note', params: { id: id } })
          break
        case 'documents':
          this.$router.push({ name: 'document', params: { id: id } })
          break
        case 'discourses':
          this.$router.push({ name: 'discourse', params: { id: id } })
          break
        case 'compositions':
          this.$router.push({ name: 'composition', params: { id: id } })
          break
        case 'topics':
          this.$router.push({ name: 'topic', params: { id: id } })
          break
        default:
          console.error('Incorrect item type for routing')
          break
      }
    },
    openAddTopic () {
      console.log(this.$refs)
      this.showTopic = true
      this.$refs.addTopic.reset()
    },
    closeAddTopic () {
      this.showTopic = false
    }
  }
}
</script>

<style>

.media-card {
  margin: 1%;
  width: 98%;
  cursor: pointer;
}

.image-card {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity .25s;
  transition-timing-function: ease-in;
}

.image-card:hover {
  opacity: 1;
}

.add-media-modal {
  padding: 30px;
  width: 100%;
}

.books {
  margin: 1%;
  width: 48%;
}

.images {
  width: 100%;
}

@media screen and (min-width: 800px) {
  .books, .movies, .videos, .articles {
    margin: 1%;
    width: 48%;
  }
}

@media screen and (min-width: 1200px) {
  .books, .movies {
    width: 23% !important;
  }
  .videos, .articles {
    width: 31% !important;
  }
  .images {
    width: 300px;
  }
  .add-media-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
