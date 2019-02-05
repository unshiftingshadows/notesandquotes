<template>
  <q-layout view="hHr LpR lFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-layout-header reveal>
      <q-toolbar>
        <q-toolbar-title>
          <img src="statics/logo.png" style="max-height: 50px" />
        </q-toolbar-title>
        <q-btn-dropdown label="Research">
          <q-list link>
            <q-item @click.native="switchNQ">
              <q-item-main>
                <q-item-tile label>Notes and Quotes</q-item-tile>
              </q-item-main>
            </q-item>
            <!-- <q-item @click.native="switchResearch">
              <q-item-main>
                <q-item-tile label>Research</q-item-tile>
              </q-item-main>
            </q-item> -->
          </q-list>
        </q-btn-dropdown>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="rightDrawer = !rightDrawer"
          v-if="pageType !== 'researchlist'"
        />
      </q-toolbar>
    </q-layout-header>

    <!-- (Optional) The Footer -->
    <!-- <q-layout-footer>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        />
        <q-toolbar-title>
          Footer
          <span slot="subtitle">Subtile</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-footer> -->

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-layout-drawer
      side="right"
      v-model="rightDrawer"
      content-class="bg-grey-9 lg-drawer"
      :breakpoint="1200"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <topic-resources v-if="pageType == 'topic'" :resources="resourceList"></topic-resources>
      </q-scroll-area>
    </q-layout-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import TopicResources from 'components/TopicResources.vue'

export default {
  components: {
    TopicResources
  },
  // name: 'LayoutName',
  mounted () {
    console.log(this.$q)
  },
  watch: {
    '$route.name': function (val) {
      this.pageType = val
      this.rightDrawer = val !== 'researchlist' && this.$q.platform.is.desktop
    }
  },
  data () {
    return {
      rightDrawer: this.$route.name !== 'researchlist' && this.$q.platform.is.desktop,
      pageType: this.$route.name,
      resourceList: []
    }
  },
  methods: {
    switchNQ () {
      this.$router.push({ name: 'dashboard' })
    },
    updateResourceList (type, id) {
      this.database.resources(type, id, (res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style>

.lg-drawer {
  width: 100%
}

@media screen and (min-width: 1200px) {
  .lg-drawer {
    width: 35%
  }
}

</style>
