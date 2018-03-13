<template>
  <div>
    <q-card inline v-if="type != 'notes' && type != 'quotes'" v-for="item in items" :key="item._id" v-bind:class="[type] + 'l'" class="media-cardl">
      <q-card-media>
        <img :src="item.thumbURL" :class="{ 'image-cardl': isImage }" @click="openItem(item._id)" />
        <q-card-title v-if="type == 'books' || type == 'movies' || type == 'videos' || type == 'articles'">
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
    <q-list v-if="type == 'notes' || type == 'quotes'">
      <q-item v-for="item in items" :key="item._id" link @click.native="openItem(item._id)">
        <q-item-main>
          <span v-if="type == 'notes'">
            <q-item-tile label>{{ item.title }}</q-item-tile>
            <q-item-tile sublabel>{{ item.text }}</q-item-tile>
          </span>
          <span v-if="type == 'quotes'">
            <q-item-tile label>{{ item.text }}</q-item-tile>
            <q-item-tile sublabel>— {{ item.mediaid.title }} | <span v-for="author in item.mediaid.author" :key="author">{{ author }} | </span></q-item-tile>
          </span>
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: ['type', 'items'],
  data () {
    return {
      isImage: this.type === 'images'
    }
  },
  methods: {
    openItem (id) {
      console.log(id)
      console.log(this.type)
      switch (this.type) {
        case 'books':
          // this.$router.push({ name: 'book', params: { id: id } })
          break
        case 'movies':
          // this.$router.push({ name: 'movie', params: { id: id } })
          break
        case 'articles':
          // this.$router.push({ name: 'article', params: { id: id } })
          break
        case 'videos':
          // this.$router.push({ name: 'video', params: { id: id } })
          break
        case 'images':
          // this.$router.push({ name: 'image', params: { id: id } })
          break
        case 'notes':
          // this.$router.push({ name: 'note', params: { id: id } })
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

.media-cardl {
  margin: 10px 0px;
  width: 100%;
}

.image-cardl {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity .25s;
  transition-timing-function: ease-in;
}

.image-cardl:hover {
  opacity: 1;
}

@media screen and (min-width: 800px) {
  .booksl, .moviesl, .imagesl, .videosl, .articlesl {
    margin: 10px;
    width: 47%;
  }
}

@media screen and (min-width: 1200px) {
  .booksl, .moviesl {
    width: 45%;
  }
  .imagesl, .videosl, .articlesl {
    width: 45%;
  }
}

</style>
