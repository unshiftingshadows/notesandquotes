<template>
  <q-page padding>
    <h1>Dashboard</h1>
    <pre>{{ response }}</pre>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      response: 'nothing'
    }
  },
  mounted () {
    console.log(this.$selectedTopic)
    this.init()
  },
  methods: {
    init () {
      this.database.list('books', this.reload)
    },
    reload (res) {
      this.response = res
    }
  }
}
</script>

<style>
</style>
