import getVideoId from 'get-video-id'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$videoId = getVideoId
}
