import { addReducer, getDispatch } from 'reactn';
import { PREFIX, APP_KEY } from './../../constants';

export function filterReducers() {
  addReducer(
    `${PREFIX}CHANGE_LIST_PARAMS`,
    (global, dispatch, action, meta) => {
      const { resource } = meta;
      const admin = { ...global[APP_KEY] };
      const { resources } = admin;
      return {
        [APP_KEY]: {
          ...admin,
          resources: {
            ...resources,
            [resource]: {
              ...resources[resource],
              list: {
                ...resources[resource].list,
                params: {
                  ...resources[resource].list.params,
                  ...action.payload,
                },
              },
            },
          },
        },
      };
    }
  );

  const dispatchers = getDispatch();
  return {
    filterList: dispatchers[`${PREFIX}CHANGE_LIST_PARAMS`],
  };
}
export default filterReducers;
