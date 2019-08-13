import { addReducer, getDispatch } from 'reactn';
import { LOADING } from './../../constants';
import { wrapArray, assertAllHaveKeys } from './../../utils';

function fetchReducers(prefix, resource, config) {
  addReducer(`${prefix}_FETCH_START`, (global, dispatch, action) => {
    return {
      [resource]: {
        ...global[resource],
        [LOADING]: true,
      },
    };
  });

  const reducerNameSuccess = `${prefix}_FETCH_SUCCESS`;
  addReducer(reducerNameSuccess, (global, dispatch, action) => {
    const records = wrapArray(action.payload);
    // All given records must have a key
    assertAllHaveKeys(config, reducerNameSuccess, records);
    return {
      [resource]: {
        ...global[resource],
        [LOADING]: false,
        data: action.data,
        records,
      },
    };
  });

  addReducer(`${prefix}_FETCH_ERROR`, (global, dispatch, action) => {
    return {
      [resource]: {
        ...global[resource],
        [LOADING]: false,
        data: action.data,
        error: action.error,
      },
    };
  });

  const dispatchers = getDispatch();
  return {
    fetchStart: dispatchers[`${prefix}_FETCH_START`],
    fetchSuccess: dispatchers[`${prefix}_FETCH_SUCCESS`],
    fetchError: dispatchers[`${prefix}_FETCH_ERROR`],
  };
}

export default fetchReducers;
