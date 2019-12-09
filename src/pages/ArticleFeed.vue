<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
export default {
  name: 'ArticleFeed',
  data () {
    return {
      newfeed: ''
    }
  },
  methods: {
    addFeed () {
      this.$firebase.list('articlefeed').add({ url: this.newfeed }).then(() => {
        Notify.create({
          message: 'Article feed added!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
    }
  }
}
</script>

<style>
</style>
