<template>
  <q-page padding>
    <h2>{{ type }}</h2>
    <q-card inline v-if="type != 'notes' && type != 'research'" v-for="item in items" :key="item['_id']" v-bind:class="[type]" class="media-card">
      <q-card-media>
        <img v-if="type != 'images'" :src="item.imageURL" />
        <img v-if="type == 'images'" :src="item.thumbURL" class="image-card" @click="openItem(item['_id'])" />
        <q-card-title slot="overlay" v-if="type == 'books' || type == 'movies' || type == 'videos' || type == 'articles'">
          {{ item.title }}
          <span v-for="author in item.author" :key="author.toString" slot="subtitle">{{ author.toString }}</span>
          <q-icon slot="right" name="fa-ellipsis-v" color="white">
            <q-popover ref="popover">
              <q-list link class="no-border">
                <q-item @click.native="openItem(item['_id'])">
                  <q-item-main label="Details" />
                </q-item>
              </q-list>
            </q-popover>
          </q-icon>
        </q-card-title>
      </q-card-media>
    </q-card>
    <q-list v-if="type == 'notes'">
      <q-item v-for="item in items" :key="item['.key']" link @click.native="openItem(item['.key'])">
        <q-item-main>
          <q-item-tile label>{{ item.title }}</q-item-tile>
          <q-item-tile sublabel>{{ item.text }}</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
    <q-list v-if="type == 'research'">
      <q-item v-for="item in items" :key="item['.key']" link @click.native="openItem(item['.key'])">
        <q-item-main>
          <q-item-tile label>{{ item.title }}</q-item-tile>
          <q-item-tile sublabel>{{ item.dateModified }}</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      type: this.$route.params.type,
      items: []
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
      // this.$binding('items', this.firebase.store.collection(type))
      //   .then((observe) => {
      //     console.log('list loaded', type)
      //   }).catch((err) => {
      //     console.error('list not loaded', type)
      //     console.error(err.message)
      //   })
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
        case 'research':
          this.$router.push({ name: 'research', params: { id: id } })
          break
        default:
          console.error('Incorrect item type for routing')
          break
      }
    }
  }
}
</script>

<style>

.media-card {
  margin: 10px 0px;
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

@media screen and (min-width: 800px) {
  .books, .movies, .images, .videos, .articles {
    margin: 10px;
    width: 47%;
  }
}

@media screen and (min-width: 1200px) {
  .books, .movies {
    width: 23%;
  }
  .images, .videos, .articles {
    width: 31%;
  }
}

</style>
