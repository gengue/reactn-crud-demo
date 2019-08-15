import { addReducers, getDispatch } from 'reactn';
import { APP_KEY, SAVING_KEY } from './../../constants';
import { loadingState, errorState } from './../../utils';

function createReducers(prefix, resource, config) {
  const { key } = config;

  addReducers({
    [`${prefix}_CREATE_START`]: (global, dispatch, action) => {
      return loadingState(global, SAVING_KEY);
    },
    [`${prefix}_CREATE_ERROR`]: (global, dispatch, action) => {
      return errorState(global, resource, action.error, SAVING_KEY);
    },
    [`${prefix}_CREATE_SUCCESS`]: (global, dispatch, action, meta) => {
      const admin = { ...global[APP_KEY] };
      const { resources } = admin;
      const newState = {
        [APP_KEY]: {
          ...admin,
          [SAVING_KEY]: false,
          resources: {
            ...resources,
            [resource]: {
              ...resources[resource],
              data: {
                ...resources[resource].data,
                [action.payload[key]]: action.payload,
              },
            },
          },
        },
      };
      // side effects
      if (meta && meta.onSuccess) {
        const { notification, redirectTo } = meta.onSuccess;
        console.log('Nojoooda', notification, redirectTo);
      }
      return newState;
    },
  });

  const dispatchers = getDispatch();
  return {
    createStart: dispatchers[`${prefix}_CREATE_START`],
    createError: dispatchers[`${prefix}_CREATE_ERROR`],
    createSuccess: dispatchers[`${prefix}_CREATE_SUCCESS`],
  };
}

export default createReducers;
