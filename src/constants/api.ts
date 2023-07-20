export default {
  BASE: '/api',
  UPLOAD: '/upload',
  AUTH: {
    BASE: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    ADD: '/add',
  },
  CATEGORY: {
    BASE: '/category',
    GET_CHILD: '/getChild',
    ADD: '/add',
    REMOVE: '/remove/:id',
    EDIT: '/edit/:id',
  },
  ARTICLE: {
    BASE: '/article',
    LIST: '/list',
    ADD: '/add',
    REMOVE: '/remove/:id',
    DETAIL: '/detail/:id',
    EDIT: '/edit/:id',
  },
} as const;
