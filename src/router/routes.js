
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: 'book/:id', name: 'book', component: () => import('pages/Book') }
    ]
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
      { path: '', name: 'topic', component: () => import('pages/Topic') }
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
