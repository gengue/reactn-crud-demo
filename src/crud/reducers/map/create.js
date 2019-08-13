import { addReducer, getDispatch } from 'reactn';
import { APP_KEY, SAVING_KEY } from './../../constants';
import { loadingState, errorState } from './../../utils';

function createReducers(prefix, resource, config) {
  const { key } = config;

  addReducer(`${prefix}_CREATE_START`, (global, dispatch, action) =>
    loadingState(global, SAVING_KEY)
  );

  addReducer(`${prefix}_CREATE_ERROR`, (global, dispatch, action) =>
    errorState(global, resource, action.error, SAVING_KEY)
  );

  addReducer(`${prefix}_CREATE_SUCCESS`, (global, dispatch, action) => {
    const admin = { ...global[APP_KEY] };
    const { resources } = admin;
    return {
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
  });

  const dispatchers = getDispatch();
  return {
    createStart: dispatchers[`${prefix}_CREATE_START`],
    createError: dispatchers[`${prefix}_CREATE_ERROR`],
    createSuccess: dispatchers[`${prefix}_CREATE_SUCCESS`],
  };
}

export default createReducers;
