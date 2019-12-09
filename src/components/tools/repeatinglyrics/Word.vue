<template>
  <span :class="colorClass" @mouseover="mouseOver" @mouseleave="mouseLeave">{{ data.rawText }}</span>
</template>

<script>
export default {
  name: 'WordSpan',
  props: ['data', 'index', 'highlight'],
  data () {
    return {
      hover: false
    }
  },
  computed: {
    colorClass () {
      return this.data.mark ? 'hover-color' : ''
    }
  },
  methods: {
    mouseOver () {
      this.highlight({
        words: [this.data.cleanText],
        x: this.index,
        y: this.index,
        length: 1,
        position: 0
      })
    },
    mouseLeave () {
      this.highlight(false)
    }
  }
}
</script>

<style>
</style>
