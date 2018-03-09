<template>
  <div>
    <!-- <q-btn color="negative" @click="fixQuotes">Fix Quotes</q-btn> -->
    <h4>Quote List <small><q-icon color="primary" name="fa-plus" @click.native="openAdd" class="cursor-pointer" /> <q-icon color="primary" name="fa-toggle-down" @click.native="toggleQuotes" class="cursor-pointer" /></small></h4>
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
      <quote-form ref="quoteForm" :mediaid="id" :media="mediaObj" :media-type="type" form-type="Add" :modal-fin="closeAdd" />
    </q-modal>
  </div>
</template>

<script>
import QuoteListItem from 'components/QuoteListItem.vue'
import QuoteForm from 'components/QuoteForm.vue'

export default {
  components: {
    QuoteListItem,
    QuoteForm
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
      quotesCollection: this.firebase.quotes
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
    // this.$binding('quotes', this.quotesCollection.where('mediaid', '==', this.mediaid).where('user', '==', this.firebase.auth.currentUser.uid).orderBy('location'))
    //   .then((quotes) => {
    //     // console.log(quotes)
    //   })
    this.init()
  },
  methods: {
    init () {
      this.database.quotes(this.id, (data) => {
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
  padding: 30px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .add-quote-modal {
    min-width: 500px;
    width: 500px;
  }
}

</style>
