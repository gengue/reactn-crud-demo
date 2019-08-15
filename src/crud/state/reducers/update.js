import { addReducer, getDispatch } from 'reactn';
import { PREFIX, SAVING_KEY, APP_KEY } from './../../constants';

export function updateReducers() {
  addReducer(`${PREFIX}UPDATE_SUCCESS`, (global, dispatch, action, meta) => {
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
    updateSuccess: dispatchers[`${PREFIX}UPDATE_SUCCESS`],
  };
}

export default updateReducers;
