<template>
  <q-page padding>
    <q-spinner color="primary" class="absolute-center" size="3rem" v-if="loading && !article.errMessage" />
    <h3 v-if="article.errMessage">Sorry...but there was an error...</h3>
    <div class="row gutter-md justify-center" v-if="!loading">
      <div class="col-xs-12">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fas fa-check" disable color="positive" v-if="addState === 'y'" />
          <q-btn label="Add" icon="fas fa-plus" disable v-if="addState === 'd'" />
          <q-btn label="Add" icon="fas fa-plus" @click.native="topicAdd" v-if="addState === 'n'" />
        </span>
        <h3>{{ article.title }}</h3>
      </div>
      <div class="col-xs-12 col-md-10">
        <div class="article-content">
          <span v-html="article.html"></span>
          <br />
          <q-btn icon="fas fa-link" color="primary" class="float-right" @click.native="openLink">&nbsp;&nbsp;Original Article</q-btn>
        </div>
      </div>
      <div class="col-xs-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="article.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="article.author" float-label="Author" dark add-icon="fas fa-plus" />
          </div>
          <div class="col-6">
            <q-select v-model="article.status" float-label="Status" radio :options="statusOptions" dark />
          </div>
          <div class="col-6">
            <q-rating v-model="article.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="article.tags" float-label="Tags" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click="update">Update</q-btn>
            <q-btn color="negative" class="float-right" @click="remove">Delete</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <quote-list :mediaid="id" :media="article" media-type="article" ref="snippets" />
      </div>
      <div class="col-12">
        <media-notes :user-notes="article.notes" :update="updateNotes" :mediaid="id" media-type="article"></media-notes>
      </div>
    </div>
    <q-btn
      round
      color="primary"
      @click="openAddQuote"
      class="fixed"
      icon="fas fa-plus"
      style="right: 18px; bottom: 18px; z-index: 1000;"
      v-if="showAddQuote"
    />
    <q-modal v-model="addQuoteOpen" content-classes="add-quote-modal">
      <quote-form ref="quoteForm" :mediaid="id" :media="article" media-type="article" form-type="Add" :quote="{ text: selectedText }" :modal-fin="closeAddQuote" />
    </q-modal>
  </q-page>
</template>

<script>
import { Notify, openURL } from 'quasar'
// import selection from 'vue-text-selection'
import MediaNotes from 'components/MediaNotes.vue'
import QuoteForm from 'components/QuoteForm.vue'
import QuoteList from 'components/QuoteList.vue'

export default {
  components: {
    MediaNotes,
    QuoteForm,
    QuoteList
  },
  name: 'Article',
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      article: this.$fiery(this.$firebase.view('article', this.$route.params.id), {
        onSuccess: () => {
          if (this.article.status) {
            this.loading = false
          } else {
            this.loading = true
          }
        }
      }),
      // userData: {
      //   tags: [],
      //   notes: '',
      //   rating: 0,
      //   status: 'new'
      // },
      statusOptions: [
        {
          label: 'New',
          value: 'new'
        },
        {
          label: 'Read',
          value: 'read'
        }
      ],
      selectedText: '',
      showAddQuote: false,
      addQuoteOpen: false,
      addState: this.$selectedTopic.get() && !this.$selectedTopic.find(this.$route.params.id) ? 'n' : 'y'
    }
  },
  watch: {
    'selectedText': function (text) {
      if (text !== '') {
        this.showAddQuote = true
      } else {
        this.showAddQuote = false
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      document.addEventListener('selectionchange', () => {
        if (window.getSelection().toString() === '' && this.$q.platform.is.mobile) {

        } else {
          this.selectedText = window.getSelection().toString()
        }
      })
      // this.database.view('article', this.id, (resource, userData) => {
      //   this.article = resource
      //   this.userData = userData
      // })
    },
    updateNotes (notes) {
      this.article.notes = notes
      this.update()
    },
    // updateUserData () {
    //   var userData = {
    //     notes: this.userData.notes,
    //     tags: this.userData.tags,
    //     rating: this.userData.rating,
    //     status: this.userData.status
    //   }
    //   this.database.update(this.id, 'article', userData, { updateUserData: true }, (res) => {
    //     Notify.create({
    //       message: 'User data updated!',
    //       type: 'positive',
    //       position: 'bottom-left'
    //     })
    //   })
    // },
    update () {
      console.log('update', this.article)
      this.$fiery.update(this.article).then(() => {
        Notify.create({
          message: 'Article updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var resource = {
      //   description: this.article.description,
      //   author: this.article.author
      // }
      // this.database.update(this.id, 'article', resource, { updateUserData: false }, (res) => {
      //   Notify.create({
      //     message: 'Article updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
      // this.updateUserData()
    },
    openLink () {
      openURL(this.article.pageURL)
    },
    remove () {
      console.log('remove not implemented...')
    },
    topicAdd () {
      this.addState = 'd'
      var obj = {
        id: this.id,
        type: 'article'
      }
      this.$selectedTopic.add(obj).then((ans) => {
        this.addState = ans ? 'y' : 'n'
      })
    },
    openAddQuote () {
      this.addQuoteOpen = true
    },
    closeAddQuote (newItem) {
      // NOTE: Would normally push a new item to the Quotes array here...
      if (newItem && this.$refs.snippets.showQuotes) {
        this.$refs.snippets.quotes.push(newItem)
      }
      this.addQuoteOpen = false
    }
  }
}
</script>

<style>

.add-quote-modal {
  /* padding: 30px; */
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 1200px) {
  .add-quote-modal {
    min-width: 500px;
    width: 500px;
  }
}

.article-content h1 {
  font-size: 30pt;
}

.article-content h2 {
  font-size: 24pt;
}

.article-content h3 {
  font-size: 20pt;
}

.article-content h4 {
  font-size: 18pt;
}

.article-content h5 {
  font-size: 16pt;
}

.article-content h6 {
  font-size: 14pt;
}

.article-content blockquote {
  padding-top: 0px;
  padding-bottom: 0px;
}

.article-content a {
  color: var(--q-color-primary) !important;
}

.article-content img {
  width: 100%;
}

</style>
