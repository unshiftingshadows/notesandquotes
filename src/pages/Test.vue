<template>
  <q-page class="flex flex-center">
    <!-- content -->
    <h1>Test Page!</h1>
    <q-btn label="logout..." @click="logout" />
  </q-page>
</template>

<script>
export default {
  name: 'PageTest',
  methods: {
    logout () {
      console.log(this.$firebase.auth())
      this.$firebase.auth().signOut().then(() => {
        this.$router.replace({ path: '/' })
      })
    }
  }
}
</script>

<style>
</style>
