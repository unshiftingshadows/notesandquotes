<template>
  <div class="row gutter-sm" v-if="!loading">
    <div class="col-12">
      <h4>Recent Articles</h4>
    </div>
    <div class="col-12 col-md-4" v-for="num in 3" :key="num">
      <q-card @click.native="openItem(topArticles[num-1].id)" class="cursor-pointer" v-if="topArticles[num-1]">
        <q-card-media>
          <img :src="topArticles[num-1].thumbURL" />
        </q-card-media>
        <q-card-title>{{ topArticles[num-1].title }}</q-card-title>
      </q-card>
      <q-card @click.native="openItem(bottomArticles[num-1].id)" class="cursor-pointer" v-if="bottomArticles[num-1]" style="padding-top: 10px;">
        <q-card-media>
          <img :src="bottomArticles[num-1].thumbURL" />
        </q-card-media>
        <q-card-title>{{ bottomArticles[num-1].title }}</q-card-title>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentArticle',
  fiery: true,
  data () {
    return {
      loading: true,
      articles: this.$fiery(this.$firebase.list('article'), {
        query: (list) => list.where('status', '==', 'new').orderBy('dateAdded', 'desc').limit(6),
        key: 'id',
        exclude: ['id'],
        onSuccess: () => {
          console.log('done loading article', this.articles)
          this.loading = false
        }
      })
    }
  },
  computed: {
    topArticles: function () {
      return this.articles.filter((val, index) => { return index % 2 === 0 })
    },
    bottomArticles: function () {
      return this.articles.filter((val, index) => { return index % 2 !== 0 })
    }
  },
  methods: {
    openItem (id) {
      this.$router.push({ name: 'article', params: { id: id } })
    }
  }
}
</script>

<style>
</style>
