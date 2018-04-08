<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header reveal>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        />
        <q-toolbar-title>
          <img src="statics/logo.png" style="max-height: 50px" />
        </q-toolbar-title>
        <q-btn v-if="selectedTopic" :label="'Current Topic: ' + selectedTopic.title" style="margin-right: 15px" @click.native="returnTopic()" />
        <q-btn-dropdown label="Notes and Quotes">
          <q-list link>
            <!-- <q-item>
              <q-item-main>
                <q-item-tile label>Notes and Quotes</q-item-tile>
              </q-item-main>
            </q-item> -->
            <q-item @click.native="switchResearch">
              <q-item-main>
                <q-item-tile label>Research</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-layout-header>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-layout-drawer
      side="left"
      v-model="leftDrawer"
      content-class="bg-grey-9"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Content here -->
        <q-item to="/dashboard">
          <q-item-side icon="fa-home" />
          <q-item-main label="Dashboard" />
        </q-item>
        <q-item link @click.native="openAddModal">
          <q-item-side icon="fa-plus" />
          <q-item-main label="Add Media" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'books' }}">
          <q-item-side icon="book" />
          <q-item-main label="Books" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'movies' }}">
          <q-item-side icon="fa-film" />
          <q-item-main label="Movies" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'images' }}">
          <q-item-side icon="fa-image" />
          <q-item-main label="Images" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'videos' }}">
          <q-item-side icon="fa-video-camera" />
          <q-item-main label="Videos" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'articles' }}">
          <q-item-side icon="fa-file-text" />
          <q-item-main label="Articles" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'notes' }}">
          <q-item-side icon="fa-sticky-note" />
          <q-item-main label="Notes" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'documents' }}">
          <q-item-side icon="fa-file" />
          <q-item-main label="Documents" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'discourses' }}">
          <q-item-side icon="fa-comment" />
          <q-item-main label="Discourses" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'compositions' }}">
          <q-item-side icon="fa-music" />
          <q-item-main label="Compositions" />
        </q-item>
        <q-item to="/settings">
          <q-item-side icon="fa-cog" />
          <q-item-main label="Settings" />
        </q-item>
        <q-item link @click.native="logout">
          <q-item-side icon="fa-sign-out" />
          <q-item-main label="Log Out" />
        </q-item>
        <span class="fixed-bottom-left">v0.1.0</span>
      </q-scroll-area>
    </q-layout-drawer>

    <q-modal ref="addModal" v-model="showAdd" content-classes="add-media-modal">
      <q-icon name="fa-close" size="2rem" @click.native="closeAddModal" class="float-right cursor-pointer" />
      <add :modal-fin="closeAddModal" ref="addMedia" />
    </q-modal>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import Add from 'components/AddMedia.vue'

export default {
  components: {
    Add
  },
  data () {
    return {
      leftDrawer: true,
      searchInput: '',
      showAdd: false,
      selectedTopic: this.$selectedTopic.get()
    }
  },
  // firebase: function () {
  //   return {
  //     terms: this.firebase.searchTerms
  //   }
  // },
  methods: {
    logout () {
      console.log('signing out')
      this.firebase.auth.signOut().then(() => {
        this.$router.replace('login')
      })
    },
    search (searchInput, done) {
      console.log('search')
      if (searchInput.split(':')[0] === 'tag') {
        done([
          {
            label: searchInput.split(':')[1].split(',').join('&'),
            sublabel: 'tag',
            type: 'tag'
          }
        ])
      } else {
        var options = {
          keys: ['title']
        }
        var fuse = this.$fuse(this.terms, options)
        var results = fuse.search(searchInput)
        results.forEach(function (result) {
          result.label = result.title
          result.sublabel = result.type
        })
        done(results)
      }
    },
    selected (item) {
      console.log(item)
      console.log('selected')
      console.log(this.$refs.searchModal)
      var id = ''
      if (item.type === 'tag') {
        id = item.label
      } else {
        id = item['.key']
      }
      if (this.$refs.searchModal.active) {
        this.$refs.searchModal.close(() => {
          this.$router.push({ name: item.type, params: { id: id } })
        })
      } else {
        this.$router.push({ name: item.type, params: { id: id } })
      }
    },
    openAddModal () {
      this.showAdd = true
      this.$refs.addMedia.reset()
    },
    closeAddModal () {
      this.showAdd = false
    },
    switchResearch () {
      this.$router.push({ name: 'researchlist', params: { type: 'topics' } })
    },
    returnTopic () {
      this.$router.push({ name: 'topic', params: { id: this.$selectedTopic.get().id } })
      this.$selectedTopic.cancel()
    }
  }
}
</script>

<style>

.add-media-modal {
  padding: 30px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .add-media-modal {
    min-width: 500px;
    width: 500px;
  }
}

@media screen and (min-width: 700px) {
  /* Fix toolbar after this point... */
}

</style>
