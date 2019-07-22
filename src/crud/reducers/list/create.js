import { addReducer, getDispatch } from 'reactn';
import { BUSY } from './../../constants';

function createReducers(prefix, resource, config) {
  addReducer(`${prefix}_CREATE_START`, (global, dispatch, action) => {
    return {
      [resource]: {
        ...global[resource],
        [BUSY]: true,
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
        [BUSY]: false,
        data: action.data,
        records,
      },
    };
  });

  addReducer(`${prefix}_CREATE_ERROR`, (global, dispatch, action) => {
    return {
      [resource]: {
        ...global[resource],
        [BUSY]: false,
        data: action.data,
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
