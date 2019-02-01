<template>
  <div>
    <q-card v-for="(section, index) in sectionData" :key="section.id" class="section-card" flat dark style="position: relative;">
      <q-card-title v-if="!sectionsLoading" style="background-color: var(--q-color-primary); margin: -2px; margin-bottom: 10px;">
        <div class="row gutter-md">
          <div class="col-auto" style="position: relative;">
            <q-btn icon="fas fa-chevron-up" color="primary" size="xs" :disabled="index === 0" @click.native="sectionUp(index)" />
            <br/>
            <q-btn icon="fas fa-chevron-down" color="primary" size="xs" style="margin-top: 12px;" :disabled="index === sectionOrder.length - 1" @click.native="sectionDown(index)" />
          </div>
          <div class="col">
            <q-input v-model="section.title" placeholder="Title" dark style="font-size: 1.5rem;" @change="val => updateSection(section.id, 'title', val)" />
            <q-input v-model="section.subtitle" placeholder="Subtitle" dark style="height: 2rem; font-size: .8rem;" @change="val => updateSection(section.id, 'subtitle', val)" />
          </div>
          <div class="col-4">
            <q-btn label="Remove" color="negative" style="padding: 2px; position: absolute; top: 5px; right: 5px; z-index: 100;" dense outline>
              <q-popover anchor="bottom right" self="top right">
                <q-list link>
                  <q-item v-close-overlay @click.native="removeSection(section.id)">Are you sure?</q-item>
                </q-list>
              </q-popover>
            </q-btn>
            <div style="height: 11px;" />
            <q-chips-input v-model="section.tags" stack-label="Tags" dark @change="val => updateSection(section.id, 'tags', val)" />
          </div>
        </div>
      </q-card-title>
      <q-card-main v-if="!resourcesLoading">
        <draggable :list="section.modules" @change="val => onModuleDrag(val, section.id)" ref="moduleDrag" :options="{ invertSwap: true, swapThreshold: 1, handle: '.drag-handle', group: { name: 'modules', put: ['modules','media'] }, disabled: $q.platform.is.mobile }">
          <topic-module v-for="(mod, index) in section.modules" :key="mod.key" :data="mod" :mod="mod.type === 'media' ? resources[mod.id] : null" :save="(val, type) => updateMod(section.id, index, val, type)" :remove="val => removeMod(section.id, index)" />
        </draggable>
        <div class="relative-position" style="height: 70px;">
          <q-btn-group class="absolute-center">
            <q-btn icon="fas fa-plus" label="Text" color="primary" @click.native="addText(section.id)" />
            <q-btn icon="fas fa-plus" label="Bible" color="secondary" @click.native="addBible(section.id)" />
          </q-btn-group>
        </div>
      </q-card-main>
    </q-card>
    <div class="relative-position" style="height: 70px;">
      <q-btn color="primary" icon="fas fa-plus" round class="absolute-center" @click.native="addSection" />
    </div>
    <q-modal v-model="chooseSection" @hide="tmpMedia = ''">
      <div class="row gutter-md" style="padding: 30px;">
        <div class="col-12">
          <h4>Choose a Section...</h4>
        </div>
        <div class="col-6" v-for="section in sectionData" :key="section.id">
          <q-btn :label="section.title" color="primary" class="full-width" @click.native="addMedia(section.id, tmpMedia)" />
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import TopicModule from 'components/TopicModule'

export default {
  components: {
    Draggable,
    TopicModule
  },
  name: 'TopicNotes',
  fiery: true,
  props: ['sectionOrder', 'newSection', 'deleteSection', 'swapSection'],
  data () {
    return {
      resourcesLoading: true,
      resources: [],
      sectionsLoading: true,
      sections: this.$fiery(this.$firebase.view('topic', this.$route.params.id).collection('sections'), {
        map: true,
        onSuccess: () => {
          this.sectionsLoading = false
        }
      }),
      chooseSection: false,
      tmpMedia: ''
    }
  },
  computed: {
    sectionData () {
      return this.sectionOrder.map(e => { return { id: e, ...this.sections[e] } })
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.resources = (await this.$firebase.getTopicResources(this.$route.params.id)).reduce((obj, item) => { obj[item.key] = item; return obj }, {})
      this.resourcesLoading = false
      this.$root.$on('add-topic-media', (id, sectionid) => {
        if (sectionid) {
          this.addMedia(sectionid, id)
        } else {
          this.tmpMedia = id
          this.chooseSection = true
        }
      })
    },
    async addSection () {
      var section = await this.$firebase.view('topic', this.$route.params.id).collection('sections').add({
        title: 'New Section',
        subtitle: 'New Section...',
        modules: [],
        tags: []
      })
      this.newSection(section.id)
    },
    updateSection (id, field, val) {
      this.sections[id][field] = val
      this.$fiery.update(this.sections[id])
    },
    removeSection (id) {
      this.deleteSection(id)
      this.$fiery.remove(this.sections[id])
    },
    sectionUp (index) {
      if (index > 0) {
        this.swapSection(index, index - 1)
      } else {
        console.error('cannot swap up from 0')
      }
    },
    sectionDown (index) {
      if (index < this.sectionOrder.length - 1) {
        this.swapSection(index, index + 1)
      } else {
        console.error('cannot swap down from end')
      }
    },
    addText (id) {
      console.log('addText')
      this.sections[id].modules.push({
        type: 'text',
        text: '',
        key: this.generateid()
      })
    },
    addBible (id) {
      console.log('addBible')
      this.sections[id].modules.push({
        type: 'bible',
        ref: '',
        text: '',
        key: this.generateid()
      })
    },
    addMedia (id, mediaid) {
      console.log('addMedia')
      this.chooseSection = false
      this.sections[id].modules.push({
        type: 'media',
        id: mediaid,
        key: this.generateid()
      })
      this.$fiery.update(this.sections[id])
      this.$firebase.useTopicResource(mediaid)
      this.tmpMedia = ''
    },
    async getBible (ref) {
      var finalText = await this.$bible.text(ref)
      return finalText
    },
    updateMod (sectionid, index, val, type) {
      console.log('updateMod', sectionid, index, val, type)
      switch (type) {
        case 'text':
          this.sections[sectionid].modules[index].text = val
          break
        case 'bible':
          this.sections[sectionid].modules[index].text = val.text
          this.sections[sectionid].modules[index].ref = val.ref
          break
        case 'media':
          this.sections[sectionid].modules[index].id = val
          break
        default:
          console.error('incorrect type to update modules')
      }
      this.$fiery.update(this.sections[sectionid])
    },
    removeMod (sectionid, index) {
      if (this.sections[sectionid].modules[index].type === 'media') {
        this.$firebase.unuseTopicResource(this.sections[sectionid].modules[index].id)
      }
      console.log('removeMod')
      this.sections[sectionid].modules.splice(index, 1)
      this.$fiery.update(this.sections[sectionid])
    },
    onModuleDrag (val, sectionid) {
      console.log('some module dragged', val, sectionid)
      if (val.added && val.added.element.id) {
        console.log('media to be added', val.added.element.id)
        const newIndex = this.sections[sectionid].modules.findIndex(e => { return e.id === val.added.element.id })
        this.sections[sectionid].modules.splice(newIndex, 1, { media: val.added.element.id })
      } else {
        console.log('normal module move')
      }
      this.$fiery.update(this.sections[sectionid])
    },
    generateid () {
      return '_' + Math.random().toString(36).substr(2, 9)
    }
  }
}
</script>

<style>

.section-card {
  background-color: inherit;
  border: 2px dashed var(--q-color-primary);
  margin-bottom: 10px;
}

.sortable-ghost.media-cardl {
  position: relative;
  width: 100% !important;
  height: 20px !important;
  background-color: black !important;
}

.sortable-ghost.media-cardl * {
  display: none !important;
}

</style>
