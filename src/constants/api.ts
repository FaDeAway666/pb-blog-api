export default {
  BASE: '/api',
  UPLOAD_IMG: '/uploadImg',
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
    ADD: '/add',
    REMOVE: '/remove',
    DETAIL: '/detail',
    EDIT: '/edit',
  },
} as const;
