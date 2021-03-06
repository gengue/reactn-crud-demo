import { addReducer, getDispatch } from 'reactn';
import { REGISTER_RESOURCE, PREFIX, APP_KEY } from './../../constants';

// initialize resource default state
export function resourceReducer() {
  const ACTION_NAME = `${PREFIX}${REGISTER_RESOURCE}`;

  addReducer(ACTION_NAME, (global, dispatch, action, meta) => {
    const admin = { ...global[APP_KEY] };
    const { resource, config } = meta;
    return {
      [APP_KEY]: {
        ...admin,
        resources: {
          ...admin.resources,
          [resource]: {
            props: {
              name: resource,
              ...config,
            },
            data: {},
            list: {
              ids: [],
              loadedOnce: false,
              params: {
                sort: null,
                order: 'DESC',
                page: 1,
                perPage: 10,
                filter: {},
              },
              total: 0,
            },
            error: null,
          },
        },
      },
    };
  });

  const dispatchers = getDispatch();
  return {
    registerResource: dispatchers[ACTION_NAME],
  };
}

export default resourceReducer;
