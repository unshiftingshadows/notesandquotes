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
          class="lt-md"
        />
        <q-toolbar-title>
          <img src="statics/logo.png" style="max-height: 50px" class="gt-md" />
        </q-toolbar-title>
        <q-search v-model="searchTerms" placeholder="Search..." class="on-left" color="dark" inverted icon="fas fa-search">
          <q-autocomplete
            @search="search"
            @selected="selected"
            ref="searchModal"
          />
        </q-search>
        <q-btn v-if="selectedTopic" :label="'Current Topic: ' + selectedTopic.title" style="margin-right: 15px" @click.native="returnTopic()" />
        <q-btn-dropdown label="Notes and Quotes" class="gt-md">
          <q-list link>
            <!-- <q-item>
              <q-item-main>
                <q-item-tile label>Notes and Quotes</q-item-tile>
              </q-item-main>
            </q-item> -->
            <q-item @click.native="switchResearch()">
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
        <!-- <q-search v-model="searchTerms" placeholder="Search..." class="on-left lt-sm" color="dark" inverted icon="fas fa-search">
          <q-autocomplete
            @search="search"
            @selected="selected"
            ref="searchModal"
          />
        </q-search> -->
        <q-item to="/dashboard">
          <q-item-side icon="fas fa-home" />
          <q-item-main label="Dashboard" />
        </q-item>
        <q-item link @click.native="openAddModal">
          <q-item-side icon="fas fa-plus" />
          <q-item-main label="Add Media" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'book' }}">
          <q-item-side icon="fas fa-book" />
          <q-item-main label="Books" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'movie' }}">
          <q-item-side icon="fas fa-film" />
          <q-item-main label="Movies" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'image' }}">
          <q-item-side icon="fas fa-image" />
          <q-item-main label="Images" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'video' }}">
          <q-item-side icon="fas fa-video" />
          <q-item-main label="Videos" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'article' }}">
          <q-item-side icon="fas fa-file-alt" />
          <q-item-main label="Articles" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'note' }}">
          <q-item-side icon="fas fa-sticky-note" />
          <q-item-main label="Notes" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'document' }}">
          <q-item-side icon="fas fa-file" />
          <q-item-main label="Documents" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'discourse' }}">
          <q-item-side icon="fas fa-comment" />
          <q-item-main label="Discourses" />
        </q-item>
        <q-item :to="{ name: 'list', params: { type: 'composition' }}">
          <q-item-side icon="fas fa-music" />
          <q-item-main label="Compositions" />
        </q-item>
        <q-item-separator class="lt-md" />
        <q-item link @click.native="switchResearch()" class="lt-md">
          <!-- <q-item-side icon="fas fa-home" /> -->
          <q-item-main label="Research" />
        </q-item>
        <q-item-separator class="lt-md" />
        <q-item to="/settings">
          <q-item-side icon="fas fa-cog" />
          <q-item-main label="Settings" />
        </q-item>
        <q-item link @click.native="logout">
          <q-item-side icon="fas fa-sign-out-alt" />
          <q-item-main label="Log Out" />
        </q-item>
        <span class="fixed-bottom-left">v0.1.11</span>
      </q-scroll-area>
    </q-layout-drawer>

    <q-modal ref="addModal" v-model="showAdd" content-classes="add-media-modal">
      <q-btn icon="fas fa-times" color="primary" @click.native="closeAddModal" class="float-right" />
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
  name: 'NQ',
  fiery: true,
  data () {
    return {
      leftDrawer: true,
      searchInput: '',
      showAdd: false,
      selectedTopic: this.$selectedTopic.get(),
      searchTerms: '',
      index: []
    }
  },
  // firebase: function () {
  //   return {
  //     terms: this.firebase.searchTerms
  //   }
  // },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$firebase.db.ref('searchIndex').once('value').then((snapshot) => {
        const data = snapshot.val()
        this.index = [].concat.apply([], Object.keys(data).map(type => {
          return Object.keys(data[type]).map(e => { return { ...data[type][e], type: type, '.key': e } })
        }))
      })
    },
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
          threshold: 0.2,
          keys: [{
            name: 'title',
            weight: 0.3
          }, {
            name: 'author',
            weight: 0.2
          }, {
            name: 'tags',
            weight: 0.5
          }]
        }
        var fuse = new this.$fuse(this.index, options)
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
      this.$router.push({ name: item.type, params: { id: id } })
      // if (this.$refs.searchModal.active) {
      //   this.$refs.searchModal.hide(() => {
      //     this.$router.push({ name: item.type, params: { id: id } })
      //   })
      // } else {
      //   this.$router.push({ name: item.type, params: { id: id } })
      // }
    },
    openAddModal () {
      this.showAdd = true
      this.$refs.addMedia.reset()
    },
    closeAddModal () {
      this.showAdd = false
    },
    switchResearch () {
      this.$router.push({ name: 'researchlist', params: { type: 'topic' } })
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
