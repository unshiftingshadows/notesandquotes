<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
// IMPORTANT!! Used to ensure that quill editors work properly
//             in PWAs
import FastClick from 'fastclick'
FastClick.notNeeded = true

export default {
  name: 'App'
}
</script>

<style>
</style>
