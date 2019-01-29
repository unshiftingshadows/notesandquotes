import * as Sentry from '@sentry/browser'

let uEmail = ''
let uName = ''

function setUser (uid, email, username) {
  uEmail = email
  uName = username
  Sentry.configureScope((scope) => {
    scope.setUser({
      email: email,
      id: uid,
      username: username
    })
  })
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Sentry.init({
    dsn: 'https://2dcec54e3241491d977d725376fb86bf@sentry.io/1380085',
    integrations: [new Sentry.Integrations.Vue({ Vue })],
    environment: 'site',
    beforeSend (event) {
      if (event.exception) {
        Sentry.showReportDialog({
          user: {
            email: uEmail,
            name: uName
          }
        })
      }
      return event
    }
  })
  Vue.prototype.$sentry = {
    setUser,
    err: Sentry.captureException,
    log: Sentry.captureMessage,
    crumb: Sentry.addBreadcrumb
  }
}
