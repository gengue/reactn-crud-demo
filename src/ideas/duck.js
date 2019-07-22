import { addReducer, getGlobal, getDispatch, setGlobal } from 'reactn';
import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
  RESOURCE_REQUEST,
  RESOURCE_SUCCESS,
  RESOURCE_FAILURE,
  FETCH_START,
  FETCH_END,
} from './actions';
import dataProvider from './../../dataProvider';
// default
export const getDefaultState = (name, options = {}) => ({
  list: {
    ids: [],
    params: {},
  },
  data: {},
  props: { name, options },
});

/**
 * createFetch
 * @desc This simule an "Action creator" for fetch actions
 * @param {string} resource
 * @param {function} api
 * @param {any} apiArgs
 * @returns {Promise}
 */
export async function createFetch(resource, api, apiArgs) {
  // get reducers
  const dispatchRequest = getDispatch()[RESOURCE_REQUEST];
  const dispatchSuccess = getDispatch()[RESOURCE_SUCCESS];
  const dispatchError = getDispatch()[RESOURCE_FAILURE];
  // meta object: contains the store paths and extra/config parameters
  const meta = { resource, params: apiArgs };
  // payload object: contains parameters to be sent in the fetch request
  const payload = { ...apiArgs };
  // return async function with fetch logic builth in
  return new Promise(async (resolve, reject) => {
    try {
      dispatchRequest(meta);
      const data = await api(apiArgs);
      dispatchSuccess({ meta, requestPayload: payload, payload: data.json });
      resolve(data);
    } catch (e) {
      dispatchError({ payload: e, meta });
      reject(e);
    }
  });
}

/**
 * Define reducers
 */

// fetch start/end
addReducer(RESOURCE_REQUEST, (global, dispatch, action) => {
  return { loading: true };
});

addReducer(RESOURCE_SUCCESS, (global, dispatch, action) => {
  const { meta, payload, params } = action;
  const newData = payload.reduce((acc, i) => {
    return {
      ...acc,
      [i.id]: i,
    };
  }, {});

  const newValue = {
    [meta.resource]: {
      ...global.resources[meta.resource],
      list: {
        ...global.resources[meta.resource].list,
        params: params || {},
      },
      data: {
        ...global.resources[meta.resource].data,
        ...newData,
      },
    },
  };

  return {
    loading: false,
    resources: { ...global.resources, ...newValue },
  };
});

addReducer(RESOURCE_FAILURE, (global, dispatch, action) => {
  const { meta, payload } = action;
  const message = payload.message || payload;
  const newValue = {
    [meta.resource]: {
      ...global.resources[meta.resource],
      error: message,
    },
  };
  return {
    loading: false,
    resources: { ...global.resources, ...newValue },
  };
});
