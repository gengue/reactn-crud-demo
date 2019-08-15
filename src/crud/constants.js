// store namespace
export const APP_KEY = 'vadmin';
export const PREFIX = 'VA/CRUD/';

// Function names
export const FN_FETCH = 'fetch';
export const FN_FETCH_ONE = 'fetchOne';
// special keys
export const DEFAULT_KEY = 'id';
export const LOADING_KEY = 'loading';
export const SAVING_KEY = 'saving';

export const DEFAULT_CONFIG = {
  key: DEFAULT_KEY,
  type: 'map',
  props: {
    basePath: '/',
    apiPrefix: null,
    hasList: true,
    hasEdit: true,
    hasShow: true,
    hasCreate: true,
  },
};

export function getDefaultResourceState(resource, props) {
  return {
    [resource]: {
      props: {
        name: resource,
        ...props,
      },
      data: {},
      list: {
        ids: [],
        loadedOnce: false,
        params: {
          sort: null,
          order: 'DESC',
          page: 1,
          perPage: 10,
          filter: {},
        },
        total: 0,
      },
      error: null,
    },
  };
}
