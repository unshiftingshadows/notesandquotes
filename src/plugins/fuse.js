import Fuse from 'fuse.js'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$fuse = Fuse
}
