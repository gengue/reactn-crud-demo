import { addReducer, getDispatch } from 'reactn';
import { CREATE, PREFIX, APP_KEY, SAVING_KEY } from './../../constants';

export function createReducers() {
  const ACTION_NAME = `${PREFIX}${CREATE}`;

  addReducer(ACTION_NAME, (global, dispatch, action, meta) => {
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
    createSuccess: dispatchers[ACTION_NAME],
  };
}

export default createReducers;
