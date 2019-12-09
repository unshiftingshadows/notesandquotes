<template>
  <rect :x="box.x" :y="box.y" :width="boxWidth" :height="boxWidth" :class="boxClass" @mouseover="mouseOver" @mouseleave="mouseLeave" />
</template>

<script>
export default {
  name: 'MatrixDot',
  props: ['box', 'boxWidth', 'mark', 'hover'],
  data () {
    return {}
  },
  computed: {
    boxClass () {
      return this.mark ? 'box-focus' : 'box-default'
    }
  },
  methods: {
    mouseOver () {
      this.hover(this.box)
    },
    mouseLeave () {
      this.hover(false)
    }
  }
}
</script>

<style>

.box-default {
  fill: rgb(0,255,0);
  margin: 50px;
}

.box-focus {
  fill: rgb(255,0,0);
  stroke-width: 2;
  stroke: rgb(255,0,0);
  margin: 5px;
}

</style>
