// Configuration for your app

module.exports = function (ctx) {
  return {
    plugins: [
      // 'axios',
      // 'database',
      'bible',
      'firebase',
      'fuse',
      'get-video-id',
      'masonry',
      'research',
      'sentry',
      'vuelidate',
      'types'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      // 'ionicons',
      // 'mdi',
      'fontawesome'
    ],
    supportIE: false,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      distDir: './dist',
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
        cfg.output = {
          globalObject: 'this'
        }
      }
    },
    devServer: {
      // https: true,
      host: '0.0.0.0',
      // disableHostCheck: true,
      port: 3000,
      // public: '10.0.1.61:3000',
      open: false // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QLayoutFooter',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',
        'QScrollArea',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnDropdown',
        'QBtnGroup',
        'QIcon',
        'QChip',
        'QSpinner',
        'QList',
        'QListHeader',
        'QCollapsible',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QItemSeparator',
        'QCard',
        'QCardMain',
        'QCardTitle',
        'QCardMedia',
        'QCardActions',
        'QInput',
        'QSearch',
        'QAutocomplete',
        'QSelect',
        'QRating',
        'QChipsInput',
        'QCheckbox',
        'QToggle',
        'QDatetime',
        'QModal',
        'QPopover',
        'QVideo',
        'QResizeObservable',
        'QFab',
        'QFabAction'
      ],
      directives: [
        'Ripple',
        'TouchSwipe',
        'CloseOverlay'
      ],
      plugins: [
        'Notify'
      ],
      iconSet: 'fontawesome'
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        name: 'Notes and Quotes',
        short_name: 'NQ-PWA',
        description: 'A personal research platform',
        display: 'fullscreen',
        orientation: 'portrait',
        background_color: '#333333',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128-20180414.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192-20180414.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256-20180414.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384-20180414.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512-20180414.png',
            'sizes': '512x512',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-1024x1024-20180414.png',
            'sizes': '1024x1024',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0'
  }
}
