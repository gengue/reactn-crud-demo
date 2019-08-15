import { addReducer, getDispatch } from 'reactn';
import { PREFIX, SAVING_KEY, APP_KEY } from './../../constants';

export function deleteReducers() {
  addReducer(`${PREFIX}DELETE_SUCCESS`, (global, dispatch, action, meta) => {
    const { resource } = meta;
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
    deleteSuccess: dispatchers[`${PREFIX}DELETE_SUCCESS`],
  };
}
export default deleteReducers;
