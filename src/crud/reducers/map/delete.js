import { addReducer, getDispatch } from 'reactn';
import { SAVING_KEY, APP_KEY } from './../../constants';
import { loadingState, errorState } from './../../utils';

function deleteReducers(prefix, resource, config) {
  addReducer(`${prefix}_DELETE_START`, (global, dispatch, action) =>
    loadingState(global, SAVING_KEY)
  );

  addReducer(`${prefix}_DELETE_ERROR`, (global, dispatch, action) =>
    errorState(global, resource, action.error, SAVING_KEY)
  );

  addReducer(`${prefix}_DELETE_SUCCESS`, (global, dispatch, action) => {
    const admin = { ...global[APP_KEY] };
    const { resources } = admin;
    const { [action.payload]: value, ...newData } = resources[resource].data;
    const newIds = resources[resource].list.ids.filter(
      i => i !== action.payload
    );
    return {
      [APP_KEY]: {
        ...admin,
        [SAVING_KEY]: false,
        resources: {
          ...resources,
          [resource]: {
            ...resources[resource],
            data: { ...newData },
            list: {
              ...resources[resource].list,
              ids: newIds,
            },
          },
        },
      },
    };
  });

  const dispatchers = getDispatch();

  return {
    deleteStart: dispatchers[`${prefix}_DELETE_START`],
    deleteError: dispatchers[`${prefix}_DELETE_ERROR`],
    deleteSuccess: dispatchers[`${prefix}_DELETE_SUCCESS`],
  };
}

export default deleteReducers;
