<template>
  <div>
    <!-- <q-btn color="negative" @click="fixQuotes">Fix Quotes</q-btn> -->
    <h4>Snippet List <small><q-icon color="primary" name="fa-plus" @click.native="openAdd" class="cursor-pointer" /> <q-icon color="primary" name="fa-toggle-down" @click.native="toggleQuotes" class="cursor-pointer" /></small></h4>
    <q-list separator multiline v-if="showQuotes">
      <quote-list-item
        v-for="quote in quotes"
        v-bind:quoteObj="quote"
        v-bind:key="quote.id"
        location
        tags
        bible
        notes
      >
      </quote-list-item>
    </q-list>
    <q-modal v-model="addOpen" content-classes="add-quote-modal">
      <!-- <q-icon name="fa-close" size="2rem" @click.native="closeAdd" class="float-right cursor-pointer" /> -->
      <q-tabs position="top" align="center" no-pane-border>
        <q-tab default slot="title" label="Quote" name="quote-tab" icon="fa-quote-right" />
        <q-tab slot="title" label="Outline" name="outline-tab" icon="fa-list-ul" />
        <q-tab slot="title" label="Idea" name="idea-tab" icon="fa-lightbulb" />
        <q-tab slot="title" name="close" icon="fa-close" :hidden="!isMobile" disable @click.native="closeAdd" />
        <q-tab-pane name="quote-tab">
          <quote-form ref="quoteForm" :mediaid="id" :media="mediaObj" :media-type="type" form-type="Add" :modal-fin="closeAdd" />
        </q-tab-pane>
        <q-tab-pane name="outline-tab">
          <outline-form ref="outlineForm" :mediaid="id" :media="mediaObj" :media-type="type" form-type="Add" :modal-fin="closeAdd" />
        </q-tab-pane>
        <q-tab-pane name="idea-tab">
          <idea-form ref="ideaForm" :mediaid="id" :media="mediaObj" :media-type="type" form-type="Add" :modal-fin="closeAdd" />
        </q-tab-pane>
      </q-tabs>
    </q-modal>
  </div>
</template>

<script>
import QuoteListItem from 'components/QuoteListItem.vue'
import QuoteForm from 'components/QuoteForm.vue'
import OutlineForm from 'components/OutlineForm.vue'
import IdeaForm from 'components/IdeaForm.vue'

export default {
  components: {
    QuoteListItem,
    QuoteForm,
    OutlineForm,
    IdeaForm
  },
  props: ['mediaid', 'media', 'mediaType'],
  data () {
    return {
      id: this.mediaid,
      type: this.mediaType,
      mediaObj: this.media,
      quotes: [],
      addOpen: false,
      showQuotes: false,
      isMobile: this.$q.platform.is.mobile
    }
  },
  watch: {
    media (value) {
      this.mediaObj = value
    },
    mediaType (value) {
      this.type = value
    }
  },
  mounted () {
    this.init()
    console.log(this.$q.platform)
  },
  methods: {
    init () {
      this.database.snippets('quotes', this.id, (data) => {
        this.quotes = data
      })
    },
    openAdd () {
      this.addOpen = true
      this.$refs.quoteForm.init(true)
    },
    closeAdd () {
      this.addOpen = false
      // Call init to reload quotes with any updates
      this.init()
    },
    toggleQuotes () {
      if (this.showQuotes) this.showQuotes = false; else this.showQuotes = true
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
