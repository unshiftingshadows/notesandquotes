// import something here
var state = false

function getState () {
  return state
}

function setState (newState) {
  state = newState
  return true
}

function cancelState () {
  state = false
  return true
}

function findResource (res) {
  try {
    return state.resources.includes(res)
  } catch (err) {
    return false
  }
}

function addResource (res) {
  try {
    state.resources.push(res)
    return true
  } catch (err) {
    return false
  }
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$selectedTopic = {
    get: getState,
    set: setState,
    cancel: cancelState,
    find: findResource,
    add: addResource
  }
}
