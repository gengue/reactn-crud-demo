import { addReducer, getDispatch } from 'reactn';
import { SAVING_KEY, APP_KEY } from './../../constants';
import { loadingState, errorState } from './../../utils';

function updateReducers(prefix, resource, config) {
  const { key } = config;

  addReducer(`${prefix}_UPDATE_START`, (global, dispatch, action) =>
    loadingState(global, SAVING_KEY)
  );

  addReducer(`${prefix}_UPDATE_ERROR`, (global, dispatch, action) =>
    errorState(global, resource, action.error, SAVING_KEY)
  );

  addReducer(`${prefix}_UPDATE_SUCCESS`, (global, dispatch, action) => {
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
    updateStart: dispatchers[`${prefix}_UPDATE_START`],
    updateError: dispatchers[`${prefix}_UPDATE_ERROR`],
    updateSuccess: dispatchers[`${prefix}_UPDATE_SUCCESS`],
  };
}

export default updateReducers;
