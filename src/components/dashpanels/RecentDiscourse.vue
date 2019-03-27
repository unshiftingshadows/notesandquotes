<template>
  <q-card @click.native="openItem()" class="cursor-pointer">
    <div v-if="!loading">
      <q-card-title class="bg-primary">Recent Discourse</q-card-title>
      <q-card-title>{{ discourse[0].title }}</q-card-title>
      <q-card-main>{{ discourse[0].eventName }}<br/>{{ discourse[0].author.join(', ') }}</q-card-main>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'RecentDiscourse',
  fiery: true,
  data () {
    return {
      loading: true,
      discourse: this.$fiery(this.$firebase.list('discourse'), {
        query: (list) => list.where('status', '==', 'new').orderBy('dateAdded', 'desc').limit(1),
        key: 'id',
        exclude: ['id'],
        onSuccess: () => {
          this.loading = false
        }
      })
    }
  },
  methods: {
    openItem () {
      this.$router.push({ name: 'discourse', params: { id: this.discourse[0].id } })
    }
  }
}
</script>

<style>
</style>
