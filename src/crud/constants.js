// store namespace
export const APP_KEY = 'vadmin';
export const PREFIX = 'VA/CRUD/';

// Function names
export const FN_FETCH = 'fetch';
export const FN_FETCH_ONE = 'fetchOne';

// special keys
export const LOADING_KEY = 'loading';
export const SAVING_KEY = 'saving';

// actions names
export const REGISTER_RESOURCE = 'REGISTER_RESOURCE';
export const FETCH_START = 'FETCH_START';
export const FETCH_ERROR = 'FETCH_ERROR';
export const GET_LIST = 'GET_LIST_SUCCESS';
export const GET_ONE = 'GET_ONE_SUCCESS';
export const FILTER = 'CHANGE_LIST_PARAMS';
export const CREATE = 'CREATE_SUCCESS';
export const UPDATE = 'UPDATE_SUCCESS';
export const DELETE = 'DELETE_SUCCESS';

// default resource config
export const DEFAULT_CONFIG = {
  basePath: '/',
  apiPrefix: null,
  hasList: true,
  hasEdit: true,
  hasShow: true,
  hasCreate: true,
  hasDelete: true,
  components: {},
};
