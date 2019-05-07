<template>
  <q-page padding>
    <q-spinner color="primary" class="absolute-center" size="3rem" v-if="loading && !document.errMessage" />
    <h3 v-if="document.errMessage">Sorry...but there was an error...</h3>
    <div class="row gutter-md items-center" v-if="!loading">
      <div class="col-xs-12 justify-center">
        <span class="float-right" v-if="this.$selectedTopic.get()">
          <q-btn label="Added!" icon="fas fa-check" disable color="positive" v-if="addState === 'y'" />
          <q-btn label="Add" icon="fas fa-plus" disable v-if="addState === 'd'" />
          <q-btn label="Add" icon="fas fa-plus" @click.native="topicAdd" v-if="addState === 'n'" />
        </span>
        <q-btn v-if="fileTypes.includes(document.fileType) && fileURL !== ''" @click.native="wordRead = true">read</q-btn>
        <q-btn v-if="document.fileType === 'application/pdf' && fileURL !== ''" @click.native="pdfRead = true">read</q-btn>
        <q-btn v-if="fullText !== ''" @click.native="pdfText = true">text</q-btn>
        <q-btn v-if="document.fileType === 'application/pdf' && fileURL !== ''" @click.native="$refs.pdf.print()">print</q-btn>
        <!-- <q-btn v-if="document.fileType === 'text/html' && fileURL !== ''" @click.native="htmlRead = true">read</q-btn>
        <q-btn v-if="document.fileType === 'text/csv' && fileURL !== ''" @click.native="textRead = true">read</q-btn> -->
      </div>
      <div class="col-xs-12">
        <h3>{{ document.title }}</h3>
        <!-- <div id="svgContainer"></div> -->
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="document.description" type="textarea" :max-height="100" :min-rows="2" float-label="Description" dark />
          </div>
          <div class="col-6">
            <q-chips-input v-model="document.author" float-label="Author" dark add-icon="fas fa-plus" />
          </div>
          <div class="col-6">
            <q-rating v-model="document.rating" :max="5" icon="fas fa-star" size="2em" style="padding-top: 15px; padding-left: 20px" dark />
          </div>
          <div class="col-12">
            <q-chips-input v-model="document.tags" float-label="Tags" dark />
          </div>
          <div class="col-12">
            <q-input v-model="document.citation" type="textarea" :max-height="100" :min-rows="2" float-label="Citation" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" @click="update">Update</q-btn>
            <q-btn color="negative" class="float-right" @click="remove">Remove</q-btn>
          </div>
        </div>
      </div>
      <div class="col-12">
        <quote-list :mediaid="id" :media="document" media-type="document" ref="snippets" />
      </div>
      <div class="col-12">
        <media-notes :user-notes="document.notes" :update="updateNotes" :mediaid="id" media-type="document"></media-notes>
      </div>
    </div>
    <q-modal v-if="document.fileType === 'application/pdf' && fileURL !== ''" v-model="pdfRead" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="pdfRead = false; selectedText = ''" />
      <q-btn color="primary" size="xl" class="overlay-button fixed z-max" style="left: 0px; top: 50%; transform: translate(50%, -50%); -webkit-transform: translate(50%, -50%);" icon="fas fa-chevron-left" @click="prevPage" />
      <q-btn color="primary" size="xl" class="overlay-button fixed z-max" style="right: 0px; top: 50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%);" icon="fas fa-chevron-right" @click="nextPage" />
      <!-- <q-btn-group class="fixed z-max" style="bottom: 0px; left: 50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%);">
        <q-btn color="primary" size="xl" class="overlay-button" icon="fas fa-chevron-left" @click="prevPage" />
        <q-btn color="primary" size="xl" class="overlay-button" icon="fas fa-chevron-right" @click="nextPage" />
      </q-btn-group> -->
      <pdf
        :src="fileURL"
        :page="currentPage"
        ref="pdf"
        @loaded="loaded"
        @num-pages="pageCount = $event"
        @page-loaded="loadSVG($event)"
        @link-clicked="currentPage = $event"
        v-touch-swipe.horizontal="handleSwipe"
      />
      <div id="textLayer" class="textLayer"></div>
    </q-modal>
    <q-modal v-if="fullText !== ''" v-model="pdfText" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="pdfText = false; selectedText = ''" />
      <div style="padding: 40px;">
        <span>{{ fullText }}</span>
      </div>
    </q-modal>
    <q-modal v-if="fileTypes.includes(document.fileType) && fileURL !== ''" v-model="wordRead" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="wordRead = false" />
      <iframe :src="'https://view.officeapps.live.com/op/view.aspx?src=https://storage.googleapis.com/notes-and-quotes-977a3.appspot.com/documents/' + id" width='100%' height='100%' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe>
      <!-- <iframe :src="'http://docs.google.com/gview?url=' + fileURL + '&embedded=true'" width='100%' height='100%' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe> -->
    </q-modal>
    <!-- <q-modal v-if="document.fileType === 'text/html' && fileURL !== ''" v-model="htmlRead" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="htmlRead = false" />
    </q-modal>
    <q-modal v-if="document.fileType === 'text/csv' && fileURL !== ''" v-model="textRead" maximized>
      <q-btn class="overlay-button fixed z-max" style="top: 20px; right: 20px;" color="primary" icon="fas fa-times" @click.native="textRead = false" />
      <embed :src="fileURL" width="100%" type="text/plain" id="text-object">
    </q-modal> -->
    <q-btn
      round
      color="primary"
      @click="openAddQuote"
      class="fixed"
      icon="fas fa-plus"
      style="right: 18px; bottom: 18px; z-index: 10000;"
      v-if="selectedText !== ''"
    />
    <q-modal v-model="addQuoteOpen" content-classes="add-quote-modal">
      <quote-form ref="quoteForm" :mediaid="id" :media="document" media-type="document" form-type="Add" :quote="{ text: selectedText }" :modal-fin="closeAddQuote" disable />
    </q-modal>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import pdf from 'vue-pdf'
import pdfjs from 'pdfjs-dist'
import MediaNotes from 'components/MediaNotes.vue'
import QuoteForm from 'components/QuoteForm.vue'
import QuoteList from 'components/QuoteList.vue'

// const textLayer = document.getElementsByClassName('textLayer').item(0)

export default {
  components: {
    pdf,
    MediaNotes,
    QuoteForm,
    QuoteList
  },
  name: 'Document',
  fiery: true,
  data () {
    return {
      loading: true,
      id: this.$route.params.id,
      document: this.$fiery(this.$firebase.view('document', this.$route.params.id), {
        onSuccess: () => {
          if (this.document.status) {
            this.$firebase.documentsRef.child(this.id).getDownloadURL().then((url) => {
              this.fileURL = url
              this.loading = false
            })
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
          label: 'Viewed',
          value: 'viewed'
        }
      ],
      fileTypes: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      pdfRead: false,
      pdfText: false,
      wordRead: false,
      htmlRead: false,
      textRead: false,
      fileURL: '',
      currentPage: 1,
      loadedPage: 1,
      pageCount: 0,
      addState: this.$selectedTopic.get() && !this.$selectedTopic.find(this.$route.params.id) ? 'n' : 'y',
      textContent: [],
      viewports: [],
      selectedText: '',
      addQuoteOpen: false
    }
  },
  watch: {
    loadedPage: function (curPage) {
      if (curPage === this.pageCount) {
        console.log('fully loaded', this.textContent.map(e => e.items))
        this.loadSVG(1)
      }
    }
  },
  computed: {
    fullText: function () {
      return this.textContent.map(e => e.items.map(f => f.str).join(' ')).join(' ').replace(/  +/g, ' ')
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      document.addEventListener('selectionchange', () => {
        // console.log(window.getSelection().toString().replace(/  +/g, ' '))
        if (window.getSelection().toString() === '' || this.$q.platform.is.mobile) {

        } else {
          this.selectedText = window.getSelection().toString().replace(/  +/g, ' ')
        }
      })
    },
    nextPage () {
      if (this.currentPage !== this.pageCount) {
        this.currentPage++
      }
    },
    prevPage () {
      if (this.currentPage !== 1) {
        this.currentPage--
      }
    },
    loaded () {
      console.log(this.$refs.pdf.pdf, pdf, pdfjs)
      // console.log(this.$refs.pdf.pdf.getResolutionScale())
      this.$refs.pdf.pdf.forEachPage((page) => {
        console.log(page)
        this.loadedPage = page.pageNumber
        page.getTextContent().then((content) => {
          this.textContent.push({
            ...content,
            items: content.items.map(e => {
              e.str += ' '
              return e
            })
          })
        })
        this.viewports.push(page.getViewport(window.screen.width / page.getViewport(1.0).width))
      })
      console.log('something', this.pageCount)
      // console.log(this.$refs.pdf.pdf.loadPage(1, 180))
    },
    buildSVG (viewport, textContent) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg:svg')
      svg.setAttribute('width', viewport.width + 'px')
      svg.setAttribute('height', viewport.height + 'px')
      // items are transformed to have 1px font size
      svg.setAttribute('font-size', 1)

      // processing all items
      textContent.items.forEach(function (textItem) {
        // we have to take in account viewport transform, which includes scale,
        // rotation and Y-axis flip, and not forgetting to flip text.
        var tx = pdfjs.Util.transform(
          pdfjs.Util.transform(viewport.transform, textItem.transform),
          [1, 0, 0, -1, 0, 0])
        var style = textContent.styles[textItem.fontName]
        // adding text element
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'svg:text')
        text.setAttribute('transform', 'matrix(' + tx.join(' ') + ')')
        text.setAttribute('font-family', style.fontFamily)
        text.textContent = textItem.str
        svg.appendChild(text)
      })

      return svg
    },
    loadSVG (pg) {
      this.currentPage = pg
      // var svg = this.buildSVG(this.viewports[0], this.textContent[0])
      // document.getElementById('svgContainer').appendChild(svg)
      if (this.textContent[pg - 1]) {
        pdfjs.renderTextLayer({
          textContent: this.textContent[pg - 1],
          container: document.getElementById('textLayer'),
          viewport: this.viewports[pg - 1],
          textDivs: []
        })
      }
    },
    handleSwipe (obj) {
      if (obj.direction === 'left') {
        this.nextPage()
      } else if (obj.direction === 'right') {
        this.prevPage()
      } else {
        console.error('not valid swipe direction: ', obj)
      }
    },
    updateNotes (notes) {
      this.document.notes = notes
      this.update()
    },
    // updateUserData () {
    //   var userData = {
    //     notes: this.userData.notes,
    //     tags: this.userData.tags,
    //     rating: this.userData.rating,
    //     status: this.userData.status
    //   }
    //   this.database.update(this.id, 'document', userData, { updateUserData: true }, (res) => {
    //     Notify.create({
    //       message: 'User data updated!',
    //       type: 'positive',
    //       position: 'bottom-left'
    //     })
    //   })
    // },
    update () {
      console.log('update', this.document)
      this.$fiery.update(this.document).then(() => {
        Notify.create({
          message: 'Document updated!',
          type: 'positive',
          position: 'bottom-left'
        })
      })
      // var resource = {
      //   description: this.document.description,
      //   author: this.document.author
      // }
      // this.database.update(this.id, 'document', resource, { updateUserData: false }, (res) => {
      //   Notify.create({
      //     message: 'Document updated!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      // })
      // this.updateUserData()
    },
    remove () {
      console.log('remove not implemented...')
    },
    topicAdd () {
      var obj = {
        id: this.id,
        type: 'document'
      }
      this.$selectedTopic.add(obj).then((ans) => {
        this.addState = ans ? 'y' : 'n'
      })
    },
    openAddQuote () {
      // Clean up selected text
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

.pdf-viewer {
  position: relative;
  width: 100%;
}

.overlay-button {
  opacity: .5;
}

.overlay-button:hover {
  opacity: 1;
}

#text-object pre {
  color: var(--q-color-white) !important;
}

/* Hack for textLayer style... */
.textLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1.0;
}

.textLayer > div {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  -webkit-transform-origin: 0% 0%;
  -moz-transform-origin: 0% 0%;
  -o-transform-origin: 0% 0%;
  -ms-transform-origin: 0% 0%;
  transform-origin: 0% 0%;
}

.textLayer .highlight {
  margin: -1px;
  padding: 1px;

  background-color: rgb(180, 0, 170);
  border-radius: 4px;
}

.textLayer .highlight.begin {
  border-radius: 4px 0px 0px 4px;
}

.textLayer .highlight.end {
  border-radius: 0px 4px 4px 0px;
}

.textLayer .highlight.middle {
  border-radius: 0px;
}

.textLayer .highlight.selected {
  background-color: rgb(0, 100, 0);
}

.textLayer ::selection { background: rgb(0,0,255); }
.textLayer ::-moz-selection { background: rgb(0,0,255); }

.textLayer .endOfContent {
  display: block;
  position: absolute;
  left: 0px;
  top: 100%;
  right: 0px;
  bottom: 0px;
  z-index: -1;
  cursor: default;
  -webkit-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
}

.textLayer .endOfContent.active {
  top: 0px;
}

</style>
