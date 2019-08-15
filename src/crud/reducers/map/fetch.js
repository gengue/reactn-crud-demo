import { addReducer, getDispatch } from 'reactn';
import { LOADING_KEY, APP_KEY } from './../../constants';
import { loadingState, errorState } from './../../utils';

function fetchReducers(prefix, resource, config) {
  const { key } = config;

  addReducer(`${prefix}_FETCH_START`, (global, dispatch, action) =>
    loadingState(global, LOADING_KEY)
  );

  addReducer(`${prefix}_FETCH_ERROR`, (global, dispatch, action) =>
    errorState(global, resource, action.error, LOADING_KEY)
  );

  addReducer(`${prefix}_FETCH_SUCCESS`, (global, dispatch, action, meta) => {
    const ids = [];
    let newData = {};

    // it's fetchOne
    if (action.single) {
      newData = { [action.payload[key]]: action.payload };
    }
    // it's fetchList
    else {
      newData = action.payload.reduce((acc, i) => {
        ids.push(i[key]);
        return { ...acc, [i[key]]: i };
      }, {});
    }
    const admin = { ...global[APP_KEY] };
    const { resources } = admin;

    return {
      [APP_KEY]: {
        ...admin,
        [LOADING_KEY]: false,
        resources: {
          ...resources,
          [resource]: {
            ...resources[resource],
            data: meta.replace
              ? newData
              : { ...resources[resource].data, ...newData },
            list: {
              ...resources[resource].list,
              //params: { ...resources[resource].list, ...action.params },
              ids,
              loadedOnce: true,
              total: action.total,
            },
          },
        },
      },
    };
  });

  const dispatchers = getDispatch();
  return {
    fetchStart: dispatchers[`${prefix}_FETCH_START`],
    fetchError: dispatchers[`${prefix}_FETCH_ERROR`],
    fetchSuccess: dispatchers[`${prefix}_FETCH_SUCCESS`],
  };
}

export default fetchReducers;
