import { addReducer, getDispatch } from 'reactn';
import { LOADING } from './../../constants';

function createReducers(prefix, resource, config) {
  addReducer(`${prefix}_CREATE_START`, (global, dispatch, action) => {
    return {
      [resource]: {
        ...global[resource],
        [LOADING]: true,
      },
    };
  });

  addReducer(`${prefix}_CREATE_SUCCESS`, (global, dispatch, action) => {
    let records = [action.payload];
    if (global[resource] && global[resource].records) {
      records = [...global[resource].records, action.payload];
    }

    return {
      [resource]: {
        ...global[resource],
        [LOADING]: false,
        data: action.data,
        records,
      },
    };
  });

  addReducer(`${prefix}_CREATE_ERROR`, (global, dispatch, action) => {
    return {
      [resource]: {
        ...global[resource],
        [LOADING]: false,
        error: action.error,
      },
    };
  });

  const dispatchers = getDispatch();
  return {
    createStart: dispatchers[`${prefix}_CREATE_START`],
    createSuccess: dispatchers[`${prefix}_CREATE_SUCCESS`],
    createError: dispatchers[`${prefix}_CREATE_ERROR`],
  };
}

export default createReducers;
