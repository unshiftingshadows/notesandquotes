<template>
  <div class="row gutter-md">
    <div class="col-12">
      <h4>Recent Videos</h4>
    </div>
    <div class="col-12 col-md-6">
      <q-card @click.native="openItem(video[0].id)" class="cursor-pointer" v-if="video[0]">
        <div v-if="!loading">
          <q-card-media>
            <img :src="video[0].thumbURL" />
          </q-card-media>
          <q-card-title>{{ video[0].title }}</q-card-title>
        </div>
      </q-card>
    </div>
    <div class="col-12 col-md-6">
      <q-card @click.native="openItem(video[1].id)" class="cursor-pointer" v-if="video[1]">
        <div v-if="!loading">
          <q-card-media>
            <img :src="video[1].thumbURL" />
          </q-card-media>
          <q-card-title>{{ video[1].title }}</q-card-title>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentVideo',
  fiery: true,
  data () {
    return {
      loading: true,
      video: this.$fiery(this.$firebase.list('video'), {
        query: (list) => list.where('status', '==', 'new').orderBy('dateAdded', 'desc').limit(2),
        key: 'id',
        exclude: ['id'],
        onSuccess: () => {
          this.loading = false
        }
      })
    }
  },
  methods: {
    openItem (id) {
      this.$router.push({ name: 'video', params: { id: id } })
    }
  }
}
</script>

<style>
</style>
