const BCVParser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser
import { fbapp } from 'plugins/firebase'

function readable (ref) {
  const bcv = new BCVParser().parse(ref)
  // var text = bcv.osis().replace(/(\d+).(\d+)/g, '$1:$2')
  // console.log(text)
  // console.log('bcv', bcv)
  // console.log('run readable')
  if (bcv.entities[0].passages[0].start.b === bcv.entities[0].passages[0].end.b) {
    if (bcv.entities[0].passages[0].start.c === bcv.entities[0].passages[0].end.c) {
      if (bcv.entities[0].passages[0].start.v === bcv.entities[0].passages[0].end.v) {
        return bcv.entities[0].passages[0].start.b + ' ' + bcv.entities[0].passages[0].start.c + ':' + bcv.entities[0].passages[0].start.v
      } else {
        return bcv.entities[0].passages[0].start.b + ' ' + bcv.entities[0].passages[0].start.c + ':' + bcv.entities[0].passages[0].start.v + '-' + bcv.entities[0].passages[0].end.v
      }
    } else {
      return bcv.entities[0].passages[0].start.b + ' ' + bcv.entities[0].passages[0].start.c + ':' + bcv.entities[0].passages[0].start.v + '-' + bcv.entities[0].passages[0].end.c + ':' + bcv.entities[0].passages[0].end.v
    }
  } else {
    console.error('Books dont match...')
  }
}

function osis (ref) {
  console.log('run parse osis', ref)
  return new BCVParser().parse(ref).osis()
}

async function text (ref, osis) {
  var tmpRef = ref
  if (osis) {
    tmpRef = osis(ref)
  }
  // const textFunction = fbapp.functions().httpsCallable('bible-text')
  // const finalText = await textFunction({ bibleRef: tmpRef })
  // console.log('finalText', finalText)
  // return finalText.data.text
  return fbapp.functions().httpsCallable('bible-text')({ bibleRef: tmpRef }).then((res) => {
    console.log('bible text results', res)
    return fixQuotations(res.data.text)
  })
}

function fixQuotations (text) {
  console.log('text', text)
  let goodText = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').trim()
  console.log('goodText', goodText)
  if (goodText.charAt(0) === '"' || goodText.charAt(0) === "'") {
    return goodText.endsWith('"') || goodText.endsWith("'") ? goodText : goodText.concat(goodText.charAt(0) === '"' ? '"' : "'")
  } else if (goodText.endsWith('"') || goodText.endsWith("'")) {
    return goodText.endsWith('"') ? '"'.concat(goodText) : "'".concat(goodText)
  } else {
    return goodText
  }
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$bible = {
    readable,
    osis,
    text
  }
}
