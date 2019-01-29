<template>
  <q-card dark :color="data.type === 'bible' ? 'secondary' : 'dark'" class="module-card" v-if="data.type !== ''">
    <div style="position: relative;">
      <!-- Drag Handle -->
      <div class="round-borders bg-primary drag-handle" v-if="!$q.platform.is.mobile || $q.platform.is.ipad">
        <q-icon name="fas fa-grip-vertical" size="1rem" />
      </div>
      <!-- Remove button -->
      <div class="bg-negative remove-handle">
        <q-icon name="fas fa-times" size="1rem" @click.native="remove" />
      </div>
    </div>
    <q-card-title v-if="data.type === 'bible'">
      {{ bibleText }}
      <q-input class="float-right" :value="bibleReadable" @change="bibleRefUpdate" dark />
      <!-- <small class="float-right">&#8212; {{ $bible.readable(data.ref) }}</small> -->
    </q-card-title>
    <!-- <q-card-main v-if="Object.keys(data)[0] === 'ref'">
    </q-card-main> -->
    <q-card-main v-if="data.type === 'text'">
      <vue-editor
        ref="editor"
        :editorOptions="{modules:{toolbar: false}}"
        v-model="data.text"
        @text-change="change"
        @blur="save(data.text, 'text')"
      />
    </q-card-main>
    <q-card-title v-if="data.type === 'media'">
      <span v-if="$types.TITLE.includes(mod.type)">{{ mod.media.title }}</span><span v-if="$types.TITLE.includes(mod.type) && mod.type !== 'outline'"> | {{ mod.media.author.join(', ') }}</span>
      <span v-if="$types.TEXT.includes(mod.type)">{{ mod.media.text }}</span>
    </q-card-title>
    <q-card-main v-if="data.type === 'media'">
      <span v-if="$types.TITLE.includes(mod.type) && mod.type !== 'outline' && mod.type !== 'video' && mod.type !== 'image'">{{ mod.media.description }}</span>
      <div class="q-body-2" style="text-align: right;" v-if="$types.TEXT.includes(mod.type) || mod.type === 'outline'">{{ mod.media.media.title }} | {{ mod.media.media.author.join(', ') }}</div>
      <q-video v-if="mod.type === 'video'" :src="mod.media.embedURL" />
      <img v-if="mod.type === 'image'" :src="mod.media.imageURL" style="width: 100%;" />
    </q-card-main>
  </q-card>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  name: 'TopicModule',
  props: ['data', 'mod', 'save', 'remove'],
  data () {
    return {
      bibleText: this.data.type === 'bible' ? this.data.text : '',
      bibleRef: this.data.ref || '',
      bibleReadable: this.data.type === 'bible' && this.data.ref !== '' ? this.$bible.readable(this.data.ref) : '',
      textEdits: 0
    }
  },
  watch: {
    bibleRef: async function (val, oldVal) {
      console.log('bibleRef changed', val, oldVal)
      if (val !== '' && val !== oldVal) {
        console.log('bibleRef changed to update')
        this.bibleReadable = this.$bible.readable(val)
        this.bibleText = await this.$bible.text(val)
        this.save({ ref: this.bibleRef, text: this.bibleText }, 'bible')
      } else {
        this.bibleReadable = ''
        this.bibleText = ''
      }
    },
    data: function (val) {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      console.log('module init', this.data)
      if (this.data.type === 'bible') {
        this.bibleRef = this.data.ref
        this.bibleText = this.data.text
      } else if (this.data.type === 'media') {
        if (this.mod === null) {
          console.error('media missing module info')
        }
      }
    },
    bibleRefUpdate (val) {
      console.log('bibleRefUpdate')
      this.bibleRef = this.$bible.osis(val)
    },
    change (delta, oldDelta, source) {
      this.textEdits += 1
      if (this.textEdits > 100) {
        this.textEdits = 0
        this.save(this.data.text, 'text')
      }
    }
  }
}
</script>

<style>

.module-card {
  margin-bottom: 10px;
}

.drag-handle {
  float: left;
  height: 40px;
  width: 20px;
  margin-right: -5px;
  padding-top: 11px;
  padding-left: 5px;
  padding-right: 4px;
  opacity: 0.5;
  cursor: move;
}

.drag-handle:hover {
  opacity: .7;
}

.remove-handle {
  position: absolute;
  height: 30px;
  width: 30px;
  padding-top: 6px;
  padding-left: 9px;
  padding-right: 9px;
  opacity: 0.7;
  right: -5px;
  top: -5px;
  border-radius: 50px !important;
  z-index: 1000;
  cursor: pointer;
}

.remove-handle:hover {
  opacity: .9;
}

</style>
