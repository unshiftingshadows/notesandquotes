<template>
  <div class="lyric-pane">
    <template v-for="(word, index) in words">
      <Word :key="word.rawText + index" :data="word" :index="index" :highlight="highlight" />
      &#32;
      <br :key="'lb' + word.rawText + index" v-if="word.lineEnd === 1" />
      <template v-if="word.lineEnd === 2">
        <br :key="'lb' + word.rawText + index + '1'" />
        <br :key="'lb' + word.rawText + index + '2'" />
      </template>
    </template>
  </div>
</template>

<script>
import Word from 'components/tools/repeatinglyrics/Word'

export default {
  components: {
    Word
  },
  name: 'LyricsPane',
  props: ['words', 'high', 'highlight'],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style>

.lyric-pane {
  border: 1px solid white;
  padding: 10px;
}

.lyric-line {
  display: inline-block;
}

.hover-color {
  color: red !important;
}

</style>
