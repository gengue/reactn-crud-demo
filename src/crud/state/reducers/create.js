import { addReducer, getDispatch } from 'reactn';
import { PREFIX, APP_KEY, SAVING_KEY } from './../../constants';

export function createReducers() {
  addReducer(`${PREFIX}CREATE_SUCCESS`, (global, dispatch, action, meta) => {
    const { resource } = meta;
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
              [action.payload.id]: action.payload,
            },
          },
        },
      },
    };
  });

  const dispatchers = getDispatch();
  return {
    createSuccess: dispatchers[`${PREFIX}CREATE_SUCCESS`],
  };
}

export default createReducers;
