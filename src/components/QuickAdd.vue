<template>
  <q-spinner color="primary" class="absolute-center" size="3rem" />
</template>

<script>
import * as getVideoId from 'get-video-id'

const extensions = ['jpg', 'jpeg', 'png', 'tif', 'tiff', 'gif']

export default {
  mounted () {
    var obj = {
      url: decodeURI(this.$route.query.url),
      users: [
        this.$firebase.auth.currentUser.uid
      ]
    }
    console.log('quick add', obj)
    const checkVideo = getVideoId(obj.url)
    if (checkVideo.service === 'youtube' || checkVideo.service === 'vimeo') {
      console.log('video', obj)
      this.$firebase.list('video').add(obj).then((res) => {
        this.$router.replace({ name: 'video', params: { id: res.id } })
      })
    } else if (obj.url.indexOf('.') > 0 && obj.url.split(/\.|\?/).reduce((sum, next) => sum || extensions.includes(next), false)) {
      obj.type = 'link'
      console.log('image', obj)
      // this.$firebase.list('image').add(obj).then((res) => {
      //   this.$router.replace({ name: 'image', params: { id: res.id } })
      // })
    } else {
      console.log('article', obj)
      this.$firebase.list('article').add(obj).then((res) => {
        this.$router.replace({ name: 'article', params: { id: res.id } })
      })
    }
  }
}
</script>

<style>
</style>
