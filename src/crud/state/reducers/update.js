import { addReducer, getDispatch } from 'reactn';
import { UPDATE, PREFIX, SAVING_KEY, APP_KEY } from './../../constants';

export function updateReducers() {
  const ACTION_NAME = `${PREFIX}${UPDATE}`;

  addReducer(ACTION_NAME, (global, dispatch, action, meta) => {
    const admin = { ...global[APP_KEY] };
    const { resource } = meta;
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
    updateSuccess: dispatchers[ACTION_NAME],
  };
}

export default updateReducers;
