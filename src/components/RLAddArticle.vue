<template>
  <q-spinner color="primary" class="absolute-center" size="3rem" />
</template>

<script>
export default {
  mounted () {
    var obj = {
      url: this.$route.query.url,
      users: [
        this.$firebase.auth.currentUser.uid
      ]
    }
    console.log('add article', obj)
    // Eventually will want to be able to import video urls as well...not sure how yet...
    // this.database.add('article', obj, (res) => {
    //   this.$router.replace({ name: 'article', params: { id: res._id } })
    // })
    this.$firebase.list('article').add(obj).then((res) => {
      this.$router.replace({ name: 'article', params: { id: res.id } })
    })
  }
}
</script>

<style>
</style>
