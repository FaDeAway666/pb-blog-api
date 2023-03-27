export default {
  BASE: '/api',
  AUTH: {
    BASE: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    ADD: '/add',
  },
  CATEGORY: {
    BASE: '/category',
    ADD: '/add',
    REMOVE: '/remove/:id',
    EDIT: '/edit/:id',
  },
  ARTICLE: {
    BASE: '/article',
    ADD: '/add',
    REMOVE: '/remove',
    DETAIL: '/detail',
    EDIT: '/edit',
  },
} as const;
