import { addReducers, getDispatch } from 'reactn';
import { APP_KEY, PREFIX, LOADING_KEY, SAVING_KEY } from './../../constants';

export function fetchReducers() {
  addReducers({
    [`${PREFIX}FETCH_START`]: (global, dispatch) => ({
      [APP_KEY]: {
        ...global[APP_KEY],
        [LOADING_KEY]: true,
      },
    }),
    [`${PREFIX}FETCH_ERROR`]: (global, dispatch, action, meta) => ({
      [APP_KEY]: {
        ...global[APP_KEY],
        [SAVING_KEY]: false,
        resources: {
          [meta.resource]: {
            ...global[APP_KEY].resources[meta.resource],
            error: action.error.toString(),
          },
        },
      },
    }),
  });

  const dispatchers = getDispatch();
  return {
    fetchStart: dispatchers[`${PREFIX}FETCH_START`],
    fetchError: dispatchers[`${PREFIX}FETCH_ERROR`],
  };
}

export default fetchReducers;
