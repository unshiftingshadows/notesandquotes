<template>
  <div>
    <!-- <q-btn color="negative" @click="fixQuotes">Fix Quotes</q-btn> -->
    <h4>Snippet List <small><q-icon color="primary" name="fa-plus" @click.native="openAdd" class="cursor-pointer" /> <q-icon color="primary" name="fa-toggle-down" @click.native="toggleQuotes" class="cursor-pointer" /></small>
      <span v-if="loading">
        &nbsp;
        <q-spinner color="primary" />
      </span>
    </h4>
    <div v-if="showQuotes">
      <h5>Ideas</h5>
      <q-list separator multiline>
        <idea-list-item
          v-for="idea in ideas"
          v-bind:ideaObj="idea"
          v-bind:key="idea.id"
          location
          tags
          bible
          notes
        />
      </q-list>
      <h5>Outlines</h5>
      <bricks
        ref="bricks"
        :data="outlines"
        :sizes="isModal ? subSizes : sizes"
      >
        <template slot-scope="scope">
          <outline-list-item
            v-bind:outlineObj="scope.item"
            v-bind:key="scope.item.id"
            location
            tags
            bible
            notes
          />
        </template>
      </bricks>
      <h5>Quotes</h5>
      <q-list separator multiline>
        <quote-list-item
          v-for="quote in quotes"
          v-bind:quoteObj="quote"
          v-bind:key="quote.id"
          location
          tags
          bible
          notes
        />
      </q-list>
      <h5>Illustrations</h5>
      <q-list separator multiline>
        <illustration-list-item
          v-for="illustration in illustrations"
          v-bind:illustrationObj="illustration"
          v-bind:key="illustration.id"
          location
          tags
          bible
          notes
        />
      </q-list>
    </div>
    <q-modal v-model="addOpen" content-classes="add-quote-modal">
      <!-- <q-icon name="fa-close" size="2rem" @click.native="closeAdd" class="float-right cursor-pointer" /> -->
      <q-tabs v-model="tabSelection" position="top" align="center" no-pane-border>
        <q-tab default v-if="mediaType !=='article'" slot="title" label="Quote" name="quote-tab" icon="fa-quote-right" />
        <q-tab :default="mediaType === 'article'" slot="title" label="Outline" name="outline-tab" icon="fa-list-ul" />
        <q-tab slot="title" label="Idea" name="idea-tab" icon="fa-lightbulb" />
        <q-tab slot="title" label="Illustration" name="illustration-tab" icon="fa-info" />
        <q-tab slot="title" name="close" icon="fa-close" :hidden="!isMobile" disable @click.native="closeAdd" />
        <q-tab-pane name="quote-tab" v-if="mediaType !=='article'">
          <quote-form ref="quoteForm" :mediaid="id" :media="mediaObj" :media-type="type" form-type="Add" :modal-fin="closeAdd" />
        </q-tab-pane>
        <q-tab-pane name="outline-tab">
          <outline-form ref="outlineForm" :mediaid="id" :media="mediaObj" :media-type="type" form-type="Add" :modal-fin="closeAdd" />
        </q-tab-pane>
        <q-tab-pane name="idea-tab">
          <idea-form ref="ideaForm" :mediaid="id" :media="mediaObj" :media-type="type" form-type="Add" :modal-fin="closeAdd" />
        </q-tab-pane>
        <q-tab-pane name="illustration-tab">
          <illustration-form ref="illustrationForm" :mediaid="id" :media="mediaObj" :media-type="type" form-type="Add" :modal-fin="closeAdd" />
        </q-tab-pane>
      </q-tabs>
    </q-modal>
  </div>
</template>

<script>
import Bricks from 'vue-bricks'
import QuoteListItem from 'components/QuoteListItem.vue'
import OutlineListItem from 'components/OutlineListItem.vue'
import IdeaListItem from 'components/IdeaListItem.vue'
import QuoteForm from 'components/QuoteForm.vue'
import OutlineForm from 'components/OutlineForm.vue'
import IdeaForm from 'components/IdeaForm.vue'
import IllustrationForm from 'components/IllustrationForm.vue'

export default {
  components: {
    Bricks,
    QuoteListItem,
    OutlineListItem,
    IdeaListItem,
    QuoteForm,
    OutlineForm,
    IdeaForm,
    IllustrationForm
  },
  props: ['mediaid', 'media', 'mediaType', 'modal'],
  data () {
    return {
      id: this.mediaid,
      type: this.mediaType,
      mediaObj: this.media,
      quotes: [],
      outlines: [],
      ideas: [],
      illustrations: [],
      addOpen: false,
      showQuotes: false,
      loading: false,
      tabSelection: 'quote-tab',
      isMobile: this.$q.platform.is.mobile,
      isModal: (this.modal === ''),
      sizes: [
        { columns: 1, gutter: 20 },
        { mq: '800px', columns: 2, gutter: 20 },
        { mq: '1260px', columns: 3, gutter: 20 },
        { mq: '1600px', columns: 4, gutter: 20 }
      ],
      subSizes: [
        { columns: 1, gutter: 20 },
        { mq: '1200px', columns: 2, gutter: 20 }
      ]
    }
  },
  watch: {
    mediaid (value) {
      this.id = value
      this.init()
    },
    media (value) {
      this.mediaObj = value
    },
    mediaType (value) {
      this.type = value
    }
  },
  // mounted () {
  //   this.init()
  // },
  methods: {
    init () {
      this.showQuotes = false
      this.loading = true
      this.database.snippets('all', this.id, (data) => {
        console.log(data)
        this.quotes = data[0]
        this.outlines = data[1]
        this.ideas = data[2]
        this.illustrations = data[3]
        this.showQuotes = true
        this.loading = false
        // if (callback) callback()
      })
    },
    openAdd () {
      this.addOpen = true
      switch (this.tabSelection) {
        case 'quote-tab':
          this.$refs.quoteForm.init(true)
          break
        case 'outline-tab':
          this.$refs.outlineForm.init(true)
          break
        case 'idea-tab':
          this.$refs.ideaForm.init(true)
          break
        case 'illustration-tab':
          this.$refs.IllustrationForm.init(true)
          break
        default:
          console.log('wrong tab...')
      }
    },
    closeAdd (newItem, type) {
      this.addOpen = false
      switch (type) {
        case 'quote':
          this.quotes.push(newItem)
          break
        case 'outline':
          this.outlines.push(newItem)
          break
        case 'idea':
          this.ideas.push(newItem)
          break
        case 'illustration':
          this.illustrations.push(newItem)
          break
        default:
          console.log('wrong new add...')
      }
    },
    toggleQuotes () {
      if (this.showQuotes) {
        this.showQuotes = false
      } else {
        this.loading = true
        this.init()
      }
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

</style>
