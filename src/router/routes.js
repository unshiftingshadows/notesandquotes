
export default [
  { path: '/', redirect: '/dashboard' },

  {
    path: '/',
    component: () => import('layouts/NQ'),
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/Dashboard') },
      { path: 'list/:type', name: 'list', component: () => import('pages/List') },
      { path: 'book/:id', name: 'book', component: () => import('pages/Book') },
      { path: 'movie/:id', name: 'movie', component: () => import('pages/Movie') },
      { path: 'image/:id', name: 'image', component: () => import('pages/Image') },
      { path: 'video/:id', name: 'video', component: () => import('pages/Video') },
      { path: 'article/:id', name: 'article', component: () => import('pages/Article') },
      { path: 'note/:id', name: 'note', component: () => import('pages/Note') },
      { path: 'document/:id', name: 'document', component: () => import('pages/Document') },
      { path: 'discourse/:id', name: 'discourse', component: () => import('pages/Discourse') },
      { path: 'composition/:id', name: 'composition', component: () => import('pages/Composition') },
      { path: 'quickadd', name: 'quickadd', component: () => import('components/QuickAdd') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/login',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/Login') }
    ]
  },

  {
    path: '/test',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/Test') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/research',
    component: () => import('layouts/Research'),
    children: [
      { path: 'list/:type', name: 'researchlist', component: () => import('pages/List') },
      { path: 'topic/:id', name: 'topic', component: () => import('pages/Topic') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/tools',
    component: () => import('layouts/Tools'),
    children: [
      { path: 'repeatinglyrics', name: 'repeatinglyrics', component: () => import('pages/tools/RepeatingLyrics') },
      { path: 'lyricanalysis', name: 'lyricanalysis', component: () => import('pages/tools/LyricAnalysis') },
      { path: 'wordlists', name: 'wordlists', component: () => import('pages/tools/WordLists') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
