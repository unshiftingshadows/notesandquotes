<template>
  <q-page padding>
    <!-- <iframe
      src="https://colinmorris.github.io/SongSim/#/custom/"
      width="100%"
      height="1500px"
    /> -->
    <div class="row">
      <div class="col-12 col-md-8" ref="matrixCol">
        <Matrix :phrases="phrasesToShow" :boxWidth="boxWidth" :fullWidth="fullWidth" :high="high" :highlight="highlight" />
      </div>
      <div class="col-12 col-md-4">
        <Lyrics-Pane :words="words" :high="high" :highlight="highlight" />
        <q-btn color="primary" @click="openLyrics = true">Edit</q-btn>
      </div>
      <div class="col-12">
        <p>Total Words: {{ words.length }}</p>
        <p>Unique Words: {{ Object.keys(wordList).length }}</p>
        <p>Most Used Word: {{ mostUsedWord.word }} - {{ mostUsedWord.val }} times</p>
      </div>
      <div class="col-12 col-md-6">
        <p>Top Phrases:</p>
        <ul>
          <li v-for="phrase in getPhrasesOfFrequency(2, true)" :key="phrase.text">{{ phrase.text }} - {{ phrase.instances.length }}</li>
        </ul>
      </div>
      <div class="col-12 col-md-3">
        <p>Top Words (with stopwords):</p>
        <ul>
          <li v-for="word in topWords" :key="word.word">{{ word.word }} - {{ word.val }}</li>
        </ul>
      </div>
      <div class="col-12 col-md-3">
        <p>Top Words (no stopwords):</p>
        <ul>
          <li v-for="word in topWordsClean" :key="word.word">{{ word.word }} - {{ word.val }}</li>
        </ul>
      </div>
    </div>
    <q-modal v-model="openLyrics" content-classes="lyrics-modal" maximized>
      <q-input v-model="lyrics" type="textarea" dark />
      <q-btn color="primary" @click="update">Update</q-btn>
    </q-modal>
  </q-page>
</template>

<script>
import Matrix from 'components/tools/repeatinglyrics/Matrix'
import LyricsPane from 'components/tools/repeatinglyrics/LyricsPane'

const stopwords = [
  'i', 'you', 'the', 'a', 'to', 'me', 'my', `i'm`, 'your', 'in', 'and', 'it',
  'that', 'on', 'be', 'is', 'with', 'of', 'as', 'ye', 'thee', 'thy', 'shall',
  'im'
]

export default {
  components: {
    Matrix,
    LyricsPane
  },
  name: 'ToolRepeatingLyrics',
  data () {
    return {
      lyrics: `How firm a foundation, ye saints of the Lord,
                Is laid for your faith in His excellent word!
                What more can He say than to you He hath said,
                To you who for refuge to Jesus have fled?

                “Fear not, I am with thee, O be not dismayed,
                For I am thy God, and will still give thee aid;
                I’ll strengthen thee, help thee, and cause thee to stand,
                Upheld by My righteous, omnipotent hand.”
                
                “When through the deep waters I call thee to go,
                The rivers of sorrow shall not overflow;
                For I will be with thee, thy troubles to bless,
                And sanctify to thee thy deepest distress.”
                
                “When through fiery trials thy pathway shall lie,
                My grace, all sufficient, shall be thy supply;
                The flame shall not hurt thee; I only design
                Thy dross to consume, and thy gold to refine.”
                
                “E’en down to old age all My people shall prove
                My sovereign, eternal, unchangeable love;
                And then, when grey hairs shall their temples adorn,
                Like lambs they shall still in My bosom be borne.”
                
                “The soul that on Jesus hath leaned for repose,
                I will not, I will not desert to his foes;
                That soul, though all hell should endeavor to shake,
                I’ll never, no, never, no, never forsake!”`,
      words: [],
      phrases: [],
      phrasesu: [],
      showLength: 1,
      wordList: {},
      phraseList: {},
      topNum: 10,
      high: false,
      openLyrics: false
    }
  },
  computed: {
    boxWidth () {
      if (this.words.length > 0) {
        return Math.floor(this.$refs.matrixCol.clientWidth / this.words.length)
      } else {
        return 0
      }
    },
    fullWidth () {
      return this.boxWidth * this.words.length
    },
    phrasesToShow () {
      return this.phrasesu.filter(e => e.length >= this.showLength || e.length === 0)
    },
    mostUsedWord () {
      var max = {
        word: '',
        val: 0
      }
      for (var word in this.wordList) {
        if (this.wordList[word] > max.val && stopwords.indexOf(word) === -1) {
          max = {
            word,
            val: this.wordList[word]
          }
        }
      }
      return max
    },
    topWords () {
      var temp = Object.keys(this.wordList).map(e => { return { word: e, val: this.wordList[e] } })
      return temp.sort((a, b) => b.val - a.val).slice(0, this.topNum)
    },
    topWordsClean () {
      var temp = Object.keys(this.wordList).map(e => { return { word: e, val: this.wordList[e] } })
      return temp.sort((a, b) => b.val - a.val).filter((a) => stopwords.indexOf(a.word) === -1).slice(0, this.topNum)
    },
    phraseLengths () {
      var lengths = {}
      for (var i = 0; i < this.phrases.length; i++) {
        lengths[this.phrases[i].length] ? lengths[this.phrases[i].length]++ : lengths[this.phrases[i].length] = 1
      }
      return lengths
    },
    maxPhraseLength () {
      return Math.max(...Object.keys(this.phraseLengths))
    }
  },
  mounted () {
    this.evaluate()
  },
  methods: {
    evaluate () {
      // Build lines
      var lines = this.lyrics.replace(/(”|“|'|")/g, '').split(`\n`).map(e => {
        return {
          words: e.trim().split(' ')
        }
      })
      // Build words
      this.words = []
      this.wordList = []
      for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines[i].words.length; j++) {
          if (/[a-zA-Z]/i.test(lines[i].words[j])) {
            var word = lines[i].words[j].trim().replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, '').toLowerCase()
            this.words.push({
              rawText: lines[i].words[j],
              cleanText: word,
              lineEnd: lines[i].words.length - 1 === j ? 1 : 0
            })
            if (this.wordList[word] > 0) {
              this.wordList[word]++
            } else {
              this.wordList[word] = 1
            }
          }
        }
        if (lines[i].words.length === 1 && !/[a-zA-Z]/i.test(lines[i].words[0])) {
          this.words[this.words.length - 1].lineEnd = 2
        }
      }
      this.generatePhrases()
    },
    generatePhrases () {
      this.phrases = []
      this.phrasesu = []
      var len = this.words.length - 1
      var lastMatch = false
      for (var i = 0; i < len; i++) {
        // this.phrases.push({
        //   text: this.words[i].cleanText,
        //   length: 0,
        //   boxes: [{
        //     x: i * this.boxWidth,
        //     y: i * this.boxWidth,
        //     key: `${i}-${i}-${this.words[i].cleanText}`,
        //     word: this.words[i].cleanText,
        //     index: i
        //   }],
        //   instances: [ i ],
        //   startPos: `${i * this.boxWidth}-${i * this.boxWidth}`
        // })
        for (var y = len; y >= len - i; y--) {
          var x = i - (len - y)
          if (x > len || y > len) {
            console.error('wrong length...', x, y)
          }
          if (x === y) {
            console.log('something went wrong...')
          }
          if (this.words[x].cleanText === this.words[y].cleanText) {
            if (lastMatch) {
              this.phrases[this.phrases.length - 1].text = `${this.words[y].cleanText} ` + this.phrases[this.phrases.length - 1].text
              this.phrases[this.phrases.length - 1].length++
              this.phrases[this.phrases.length - 1].boxes.push({
                x: x * this.boxWidth,
                y: y * this.boxWidth,
                key: `${x}-${y}-${this.words[y].cleanText}`,
                word: this.words[y].cleanText,
                index: y
              })
            } else {
              this.phrases.push({
                text: this.words[y].cleanText,
                length: 1,
                boxes: [{
                  x: x * this.boxWidth,
                  y: y * this.boxWidth,
                  key: `${x}-${y}-${this.words[y].cleanText}`,
                  word: this.words[y].cleanText,
                  index: y
                }],
                instances: [ x, y ],
                startPos: `${x * this.boxWidth}-${y * this.boxWidth}`
              })
              lastMatch = true
            }
          } else {
            if (lastMatch) {
              var index = this.phrasesu.map(e => e.text).indexOf(this.phrases[this.phrases.length - 1].text)
              if (index === -1) {
                this.phrasesu.push({
                  ...(this.phrases[this.phrases.length - 1]),
                  frequency: 1
                })
              } else {
                // console.log('dupe', this.phrasesu[index])
                this.phrasesu[index].frequency++
                this.phrasesu[index].boxes = this.phrasesu[index].boxes.concat(this.phrases[this.phrases.length - 1].boxes)
                // this.phrasesu[index].instances = this.phrasesu[index].instances.concat(this.phrases[this.phrases.length - 1].instances)
                this.phrases[this.phrases.length - 1].instances.forEach(z => {
                  if (this.phrasesu[index].instances.indexOf(z) === -1) {
                    this.phrasesu[index].instances.push(z)
                  }
                })
              }
            }
            lastMatch = false
          }
        }
      }
      // Add missing line word
      // this.phrases.push({
      //   text: this.words[len].cleanText,
      //   length: 0,
      //   boxes: [{
      //     x: len * this.boxWidth,
      //     y: len * this.boxWidth,
      //     key: `${len}-${len}-${this.words[len].cleanText}`,
      //     word: this.words[len].cleanText,
      //     index: len
      //   }],
      //   instances: [ len ],
      //   startPos: `${len * this.boxWidth}-${len * this.boxWidth}`
      // })
      // Add single line words
      console.log('add single line')
      this.phrasesu = this.phrasesu.concat(this.words.map((e, index) => {
        return {
          text: e.cleanText,
          length: 0,
          boxes: [{
            x: index * this.boxWidth,
            y: index * this.boxWidth,
            key: `${index}-${index}-${e.cleanText}`,
            word: e.cleanText,
            index: index
          }],
          instances: [ index ],
          startPos: `${index * this.boxWidth}-${index * this.boxWidth}`,
          frequency: 1
        }
      }))
    },
    getPhrasesOfLength (len, up) {
      return this.phrasesu.filter(e => up ? e.length >= len : e.length === len)
    },
    getPhrasesOfFrequency (freq, up) {
      return this.phrasesu.filter(e => up ? e.instances.length >= freq && e.length >= 2 : e.instances.length === freq && e.length >= 2)
    },
    highlight (val) {
      this.high = val
      if (val.length === 0 || val.length === 1) {
        // Just highlight any instances of word
        this.words = this.words.map(e => {
          return {
            ...e,
            mark: val.words[0] === e.cleanText
          }
        })
      } else if (val.length > 1) {
        // Highlight any phrases based on instances
        var indexes = []
        for (var i = 0; i < val.instances.length; i++) {
          for (var j = val.length - 1; j >= 0; j--) {
            indexes.push(val.instances[i] - j)
          }
        }
        for (var k = 0; k < indexes.length; k++) {
          this.words[indexes[k]].mark = true
        }
      } else {
        // Remove all highlights
        this.words = this.words.map(e => {
          return {
            ...e,
            mark: false
          }
        })
      }
    },
    update () {
      this.openLyrics = false
      this.evaluate()
    }
  }
}
</script>

<style>

.lyrics-modal {
  padding: 30px;
}

</style>
