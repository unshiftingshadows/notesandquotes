<template>
  <q-page padding>
    <recent-video />
    <recent-article />
  </q-page>
</template>

<script>
import RecentVideo from 'components/dashpanels/RecentVideo'
// import RecentDiscourse from 'components/dashpanels/RecentDiscourse'
import RecentArticle from 'components/dashpanels/RecentArticle'

export default {
  components: {
    RecentVideo,
    // RecentDiscourse,
    RecentArticle
  },
  name: 'Dashboard',
  data () {
    return {
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    }
  }
}
</script>

<style>
</style>
