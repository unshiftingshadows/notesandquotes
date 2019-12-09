<template>
  <q-layout view="hHh Lpr lFf">

    <!-- (Optional) The Header -->
    <q-layout-header reveal>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawer = !leftDrawer"
          class="lt-md"
        />
        <q-toolbar-title>
          <img src="statics/logo.png" style="max-height: 50px" class="gt-md" />
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-layout-drawer
      side="left"
      v-model="leftDrawer"
      content-class="bg-grey-9"
      :width="250"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <q-item to="/tools/repeatinglyrics">
          <q-item-side icon="fas fa-music" />
          <q-item-main label="Repeating Lyrics" />
        </q-item>
        <q-item to="/tools/lyricanalysis">
          <q-item-side icon="fas fa-music" />
          <q-item-main label="Lyric Analysis" />
        </q-item>
        <q-item to="/tools/wordlists">
          <q-item-side icon="fas fa-list" />
          <q-item-main label="Word Lists" />
        </q-item>
        <!-- <q-item link @click.native="openAddModal">
          <q-item-side icon="fas fa-plus" />
          <q-item-main label="Add Media" />
        </q-item> -->
      </q-scroll-area>
    </q-layout-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'ToolsLayout',
  data () {
    return {
      leftDrawer: true
    }
  }
}
</script>

<style>
</style>
