import { addReducer, getDispatch } from 'reactn';
import { LOADING } from './../../constants';

function updateReducers(prefix, resource, config) {
  addReducer(`${prefix}_UPDATE_START`, (global, dispatch, action) => {
    return {
      [resource]: {
        ...global[resource],
        [LOADING]: true,
      },
    };
  });

  addReducer(`${prefix}_UPDATE_SUCCESS`, (global, dispatch, action) => {
    let records = [action.payload];
    if (global[resource] && global[resource].records) {
      records = [...global[resource].records, action.payload];
    }

    return {
      [resource]: {
        ...global[resource],
        [LOADING]: false,
        data: global[resource].data.map(i => {
          if (i.id === action.data.id) {
            return action.data;
          }
          return i;
        }),
        records,
      },
    };
  });

  addReducer(`${prefix}_UPDATE_ERROR`, (global, dispatch, action) => {
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
    updateStart: dispatchers[`${prefix}_UPDATE_START`],
    updateSuccess: dispatchers[`${prefix}_UPDATE_SUCCESS`],
    updateError: dispatchers[`${prefix}_UPDATE_ERROR`],
  };
}

export default updateReducers;
