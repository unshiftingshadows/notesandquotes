<template>
  <svg ref="matrixdiv" class="lyric-matrix" :width="fullWidth" :height="fullWidth">
    <template v-if="high">
      <rect class="alley" :x="(high.x - high.position) * boxWidth" y="0" :width="high.length * boxWidth" :height="fullWidth" style="fill: rgba(255,255,255,0.1)" />
      <rect class="alley" x="0" :y="(high.y - high.position) * boxWidth" :width="fullWidth" :height="high.length * boxWidth" style="fill: rgba(255,255,255,0.1)" />
    </template>
    <Phrase v-for="phrase in phrases" :key="`${phrase.startPos}-${phrase.text}`" :phrase="phrase" :boxWidth="boxWidth" :high="high" :highlight="highlight" />
  </svg>
</template>

<script>
import Phrase from 'components/tools/repeatinglyrics/Phrase'

export default {
  components: {
    Phrase
  },
  name: 'LyricMatrix',
  props: ['phrases', 'boxWidth', 'fullWidth', 'high', 'highlight'],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style>

.lyric-matrix {
  cursor: crosshair;
}

</style>
