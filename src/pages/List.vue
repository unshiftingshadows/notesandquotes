<template>
  <q-page padding>
    <h3>{{ type }} <q-btn v-if="type == 'topics'" size="sm" icon="fa-plus" color="primary" @click.native="openAddTopic" /></h3>
    <q-card inline v-if="type != 'notes' && type != 'topics'" v-for="item in items" :key="item._id" v-bind:class="[type]" class="media-card">
      <q-card-media>
        <img :src="item.thumbURL" :class="{ 'image-card': isImage }" @click="openItem(item._id)" />
        <q-card-title slot="overlay" v-if="type == 'books' || type == 'movies' || type == 'videos' || type == 'articles'">
          {{ item.title }}
          <span v-for="author in item.author" :key="author.fullName" slot="subtitle">{{ author.fullName }}</span>
          <q-icon slot="right" name="fa-ellipsis-v" color="white">
            <q-popover ref="popover">
              <q-list link class="no-border">
                <q-item @click.native="openItem(item._id)">
                  <q-item-main label="Details" />
                </q-item>
              </q-list>
            </q-popover>
          </q-icon>
        </q-card-title>
      </q-card-media>
    </q-card>
    <q-list v-if="type == 'notes' || type == 'topics'">
      <q-item v-for="item in items" :key="item._id" link @click.native="openItem(item._id)">
        <q-item-main>
          <q-item-tile label>{{ item.title }}</q-item-tile>
          <q-item-tile sublabel v-if="type == 'notes'">{{ item.text }}</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
    <q-modal ref="addModal" v-model="showTopic" content-classes="add-media-modal">
      <!-- <q-icon name="fa-close" size="2rem" @click.native="closeAddModal" class="float-right cursor-pointer" /> -->
      <add-research :modal-fin="closeAddTopic" ref="addTopic" />
    </q-modal>
  </q-page>
</template>

<script>
import AddResearch from 'components/AddResearch.vue'

export default {
  components: {
    AddResearch
  },
  data () {
    return {
      type: this.$route.params.type,
      items: [],
      isImage: this.$route.params.type === 'images',
      showTopic: false
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
      this.database.list(type, (data) => {
        console.log('data', data, this)
        this.items = data
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
  margin: 10px;
  width: 100%;
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

@media screen and (min-width: 800px) {
  .books, .movies, .images, .videos, .articles {
    margin: 10px;
    width: 47%;
  }
}

@media screen and (min-width: 1200px) {
  .books, .movies {
    width: 23% !important;
  }
  .images, .videos, .articles {
    width: 31% !important;
  }
  .add-media-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
