<template>
  <q-spinner color="primary" class="absolute-center" size="3rem" />
</template>

<script>
import * as getVideoId from 'get-video-id'

export default {
  mounted () {
    var obj = {
      url: this.$route.query.url,
      users: [
        this.$firebase.auth.currentUser.uid
      ]
    }
    console.log('quick add', obj)
    const checkVideo = getVideoId(obj.url)
    if (checkVideo.service === 'youtube' || checkVideo.service === 'vimeo') {
      this.$firebase.list('video').add(obj).then((res) => {
        this.$router.replace({ name: 'video', params: { id: res.id } })
      })
    } else {
      this.$firebase.list('article').add(obj).then((res) => {
        this.$router.replace({ name: 'article', params: { id: res.id } })
      })
    }
  }
}
</script>

<style>
</style>
