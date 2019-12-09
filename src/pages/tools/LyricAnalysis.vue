<template>
  <q-page padding>
    <div class="row gutter-md">
      <div class="col-6">
        <q-input v-model="page" type="number" label="Page #" dark />
      </div>
      <div class="col-6">
        <q-btn color="primary" @click="list()">Run</q-btn>
        <!-- <q-btn color="secondary" @click="fixStats()" class="float-right">Fix Stats</q-btn> -->
        <!-- <q-btn color="secondary" @click="addField([{name: 'ignore', val: false}])" class="float-right">Add Field</q-btn> -->
      </div>
      <div class="col-6">
        <q-select v-model="selectedCategory" label="Category" :options="categorySelect" dark />
      </div>
      <div class="col-6">
        <q-select v-model="selectedYear" label="Year" :options="yearSelect" dark />
      </div>
      <div class="col-12">
        <q-list>
          <q-item v-for="song in currentSongs" :key="song.id">
            <q-item-main>
              <q-item-tile label>
                {{ song.title }}
                <q-icon v-if="song.note" color="secondary" name="fas fa-info" size="10px">
                  <q-tooltip anchor="bottom left" self="top left">{{ song.note }}</q-tooltip>
                </q-icon>
              </q-item-tile>
              <q-item-tile sublabel>{{ song.artist }}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn-dropdown label="Change" color="secondary">
                <q-list>
                  <q-item :link="song.lyrics.status === 0" @click.native="song.lyrics.status === 0 ? runLyrics([song]) : null" v-close-overlay>
                    Get Lyrics
                  </q-item>
                  <q-item link @click.native="openNote(song)" v-close-overlay>
                    Add Note
                  </q-item>
                  <q-item-separator />
                  <q-item link v-close-overlay @click.native="removeSong(song)" class="text-negative">
                    Remove Song
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-side>
            <q-item-side right>
              Musix:
              <q-icon :name="`fas fa-${song.musixRun ? 'check' : 'times'}`" :color="song.musixRun ? 'primary' : 'light'" />
            </q-item-side>
            <q-item-side right>
              Lyrics:
              <q-spinner v-if="song.lyrics.status === 1" />
              <q-icon v-if="song.lyrics.status !== 1" :name="`fas fa-${song.lyrics.status === 2 ? 'check' : song.lyrics.status === 3 ? 'exclamation' : 'times'}`" :color="song.lyrics.status === 2 ? 'primary' : song.lyrics.status === 3 ? 'negative' : 'light'">
                <q-tooltip v-if="song.lyrics.status === 2" anchor="bottom right" self="top right"><pre v-html="song.lyrics.text" /></q-tooltip>
              </q-icon>
            </q-item-side>
            <q-item-side right>
              Analysis:
              <q-icon :name="`fas fa-${song.analysis.status === 2 ? 'check' : song.analysis.status === 3 ? 'exclamation' : 'times'}`" :color="song.analysis.status === 2 ? 'primary' : song.analysis.status === 3 ? 'negative' : 'light'" />
            </q-item-side>
          </q-item>
        </q-list>
      </div>
    </div>
    <q-modal v-model="showAdd" content-classes="list-add-modal">
      <div class="row">
        <div class="col-12">
          <q-btn color="primary" @click="add()" :disable="page <= analysis.musixLastPage || adding">Add</q-btn>
          <span v-if="page <= analysis.musixLastPage">This page has already been added...</span>
          <q-spinner v-if="adding" />
        </div>
        <div class="col-12">
          <q-list>
            <q-item v-for="song in results" :key="song.track_id">
              <q-item-main>
                <q-item-tile label>{{ song.track_name }}</q-item-tile>
                <q-item-tile sublabel>{{ song.artist_name }}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-modal>
    <q-modal v-model="showNote" content-classes="list-add-modal">
      <div class="row">
        <div class="col-12">
          {{ selectedSong.title }} Note
          <q-input type="textarea" v-model="noteText" dark />
          <q-btn color="primary" @click="saveNote(selectedSong)">Save</q-btn>
        </div>
      </div>
    </q-modal>
  </q-page>
</template>

<script>
export default {
  name: 'LyricAnalysis',
  fiery: true,
  data () {
    return {
      loading: true,
      analysis: this.$fiery(this.$firebase.store.collection('tools').doc('lyricAnalysis'), {
        onSuccess: () => {
          this.page = this.analysis.musixLastPage + 1
          this.categories = Object.keys(this.analysis.stats.categories).map(e => {
            var cat = {
              id: e,
              ...this.analysis.stats.categories[e]
            }
            cat.years = Object.keys(cat.years).map(f => {
              return {
                id: f,
                show: false,
                ...cat.years[f]
              }
            }).reverse()
            return cat
          })
          this.loading = false
        }
      }),
      songs: {},
      currentSongs: [],
      selectedCategory: '',
      selectedYear: '',
      selectedSong: {},
      // songsAll: this.$fiery(this.$firebase.store.collection('tools').doc('lyricAnalysis').collection('songs')),
      results: [],
      page: 0,
      categories: [],
      songsYear: {},
      showAdd: false,
      adding: false,
      showNote: false,
      noteText: ''
    }
  },
  watch: {
    selectedYear: function (val) {
      this.pullSongs(this.selectedCategory, this.selectedYear, this.updateCurrent)
    }
  },
  computed: {
    // yearList () {
    //   return this.songs.map(e => e.year).filter((val, index, self) => self.indexOf(val) === index)
    // },
    // yearVals () {
    //   return this.yearList.reduce((obj, e) => {
    //     obj[e === '' ? 'unknown' : e] = this.songs.filter(f => f.year === e).length
    //     return obj
    //   }, {})
    // }
    categorySelect () {
      return this.categories.map(e => { return { label: `${e.title} (${e.count})`, value: e.id } })
    },
    yearSelect () {
      return this.selectedCategory !== '' ? this.currentCategory.years.map(e => { return { label: `${e.id} (${e.count})`, value: e.id } }) : []
    },
    currentCategory () {
      return this.selectedCategory !== '' ? this.categories.find(e => e.id === this.selectedCategory) : {}
    },
    currentYear () {
      return this.selectedYear !== '' ? this.currentCategory.years.find(e => e.id === this.selectedYear) : {}
    }
  },
  methods: {
    async list () {
      this.results = (await this.$firebase.tools.listMusix(this.page, 1103)).data.map(e => e.track)
      this.showAdd = true
    },
    async add () {
      this.adding = true
      var done = await this.$firebase.tools.addMusix(this.page, 1103)
      console.log('done?', done)
      if (done.data.status === 200) {
        this.$firebase.store.collection('tools').doc('lyricAnalysis').update({
          musixLastPage: this.page
        })
      }
      this.adding = false
      this.showAdd = false
    },
    async pullSongs (category, year, callback) {
      this.loading = true
      console.log('pullSongs', category, year)
      if (this.songs[category] && this.songs[category][year] && this.songs[category][year].length > 0) {
        this.loading = false
        callback()
      } else {
        this.songs[category] = this.songs[category] || {}
        this.songs[category][year] = this.$fiery(this.$firebase.store.collection('tools').doc('lyricAnalysis').collection('songs'), {
          query: q => year !== 'unknown' ? q.where('ignore', '==', false).where('year', '==', year) : q.where('ignore', '==', false).where('year', '==', ''),
          key: 'id',
          exclude: ['id'],
          onSuccess: () => {
            this.loading = false
            callback()
          }
        })
      }
    },
    async runLyrics (docs) {
      console.log('run lyrics')
      for (var i of docs) {
        console.log('run doc', i)
        i.lyrics = {
          status: 1
        }
        this.$fiery.update(i)
      }
      this.updateCurrent()
      var status = await this.$firebase.tools.runLyrics(docs)
      console.log(status)
    },
    updateCurrent () {
      this.currentSongs = this.songs[this.selectedCategory][this.selectedYear]
    },
    openNote (song) {
      this.selectedSong = song
      this.noteText = song.note || ''
      this.showNote = true
    },
    saveNote (song) {
      song.note = this.noteText
      this.$fiery.update(song)
      this.showNote = false
      this.noteText = ''
    },
    removeSong (song) {
      this.analysis.stats.categories[song.cat].count--
      this.analysis.stats.categories[song.cat].years[song.year].count--
      song.ignore = true
      this.$fiery.update(this.analysis)
      this.$fiery.update(song)
    },
    fixStats () {
      // this.analysis.stats.categories = {
      //   '1103': this.analysis.stats[1103]
      // }
      // delete this.analysis.stats[1103]
      // this.$fiery.update(this.analysis)
      // var updates = {
      //   years: {},
      //   count: this.songs.length
      // }
      // updates.years = Object.keys(this.yearVals).reduce((obj, e) => {
      //   console.log('obj', obj, e)
      //   obj[e] = {
      //     count: this.yearVals[e]
      //   }
      //   return obj
      // }, {})
      // console.log(updates)
      // this.$firebase.store.collection('tools').doc('lyricAnalysis').update({
      //   stats: {
      //     '1103': updates,
      //     songs: this.songs.length
      //   }
      // })
    },
    addField (fields) {
      console.log(fields)
      for (let song of this.songsAll) {
        console.log('fixed', song)
        for (let field of fields) {
          if (field.val !== null) {
            song[field.name] = field.val
          } else {
            delete song[field.name]
          }
        }
        this.$fiery.update(song)
      }
    }
  }
}
</script>

<style>

.list-add-modal {
  padding: 30px;
}

</style>
