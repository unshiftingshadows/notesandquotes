<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar style="min-height: 250px">
        <!-- <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        /> -->
        <q-toolbar-title>
          <img src="statics/logo.png" style="max-height: 200px; display: block; margin-left: auto; margin-right: auto;" />
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
