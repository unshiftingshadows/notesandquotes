const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let rawdata = fs.readFileSync('words.json')
let keywords = JSON.parse(rawdata)
keywords.lists = Object.entries(keywords.lists).reduce((acc, f) => {
  acc[f[0]] = {
    ...f[1],
    set: new Set(f[1].set)
  }
  return acc
}, {})

function save () {
  let saveData = {...keywords}
  saveData.lists = Object.entries(saveData.lists).reduce((acc, f) => {
    acc[f[0]] = {
      ...f[1],
      set: [...f[1].set]
    }
    return acc
  }, {})
  let data = JSON.stringify(saveData)
  fs.writeFileSync('words.json', data)
}

function addWords (list, words) {
  keywords.lists[list].set = new Set([...keywords.lists[list].set, ...words])
}

function addList (listName) {
  keywords.lists[listName] = {
    set: new Set()
  }
}

const functions = [
  {
    lists: function () {
      clearTerminal()
      console.log('Lists: \n', Object.keys(keywords.lists).map(e => '- ' + e).join('\n'))
      rl.question('Which list would you like to add to? (Begin with [+] to add a list) ', (listEntry) => {
        if (listEntry === 'exit') {
          return init()
        }
        let list = listEntry
        if (list.indexOf('+') === 0) {
          list = list.replace('+', '').trim()
          addList(list)
        }
        if (Object.keys(keywords.lists).indexOf(list) > -1) {
          clearTerminal()
          console.log('List: ', list)
          console.log('Current Words: \n', [...keywords.lists[list].set])
          console.log('Type words to add, pressing [Enter] between each:\nLines with commas [,] will be split\n[!] to end')
          rl.on('line', (word) => {
            if (word.indexOf('!') === 0) {
              save()
              rl.question('Add words to another list? (y/n) ', (another) => {
                if (another === 'y' || another === 'Y') {
                  this.lists()
                } else {
                  init()
                }
              })
            } else {
              addWords(list, word.split(/\n|,/).map(e => e.trim()))
            }
          })
        } else {
          console.log('invalid list name')
          this.lists()
        }
      })
    }
  }
]

function clearTerminal () {
  return process.stdout.write('\033c')
}

function init () {
  clearTerminal()
  console.log('Functions: \n', functions.map((e, index) => `${index}. ${Object.keys(e)[0]}`).join('\n'))
  rl.question('Please choose function to run: ', (answer) => {
    if (answer === 'exit') {
      rl.close()
      clearTerminal()
      return
    }
    const selection = Number(answer)
    if (selection !== NaN && selection < functions.length) {
      functions[selection][Object.keys(functions[selection])[0]]()
    } else {
      console.log('invalid function, please input the index of the function...')
      init()
    }
  })
}

init()