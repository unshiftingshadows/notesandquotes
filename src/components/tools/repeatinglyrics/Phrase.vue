<template>
  <g>
    <Dot v-for="box in phrase.boxes" :key="box.key" :box="box" :boxWidth="boxWidth" :mark="mark || (high && high.words.indexOf(box.cleanText) > -1)" :hover="hover" />
    <template v-if="reverse">
      <Dot v-for="box in reverse" :key="box.key" :box="box" :boxWidth="boxWidth" :mark="mark || (high && high.words.indexOf(box.cleanText) > -1)" :hover="hover" />
    </template>
  </g>
</template>

<script>
import Dot from 'components/tools/repeatinglyrics/Dot'

export default {
  components: {
    Dot
  },
  name: 'Phrase',
  props: ['phrase', 'boxWidth', 'high', 'highlight'],
  data () {
    return {
      mark: false
    }
  },
  watch: {
    high: function (val) {
      if (val && val.words.join(' ') === this.phrase.text) {
        this.mark = true
      } else {
        this.mark = false
      }
    }
  },
  computed: {
    reverse () {
      if (this.phrase.boxes[0].x === this.phrase.boxes[0].y) {
        return false
      } else {
        return this.phrase.boxes.map(e => {
          return {
            ...e,
            x: e.y,
            y: e.x,
            key: `${e.y}-${e.x}-${e.word}`
          }
        })
      }
    }
  },
  methods: {
    hover (val) {
      this.mark = !!val
      if (val) {
        this.highlight({
          words: this.phrase.text.split(' '),
          x: val.x / this.boxWidth,
          y: val.y / this.boxWidth,
          length: this.phrase.length === 0 ? 1 : this.phrase.length,
          position: this.phrase.text.split(' ').indexOf(val.word),
          instances: this.phrase.instances
        })
      } else {
        this.highlight(false)
      }
    }
  }
}
</script>

<style>
</style>
