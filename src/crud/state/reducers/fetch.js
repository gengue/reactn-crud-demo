import { addReducers, getDispatch } from 'reactn';
import {
  FETCH_START,
  FETCH_ERROR,
  APP_KEY,
  PREFIX,
  LOADING_KEY,
  SAVING_KEY,
} from './../../constants';

export function fetchReducers() {
  const ACTION_NAME_START = `${PREFIX}${FETCH_START}`;
  const ACTION_NAME_ERROR = `${PREFIX}${FETCH_ERROR}`;

  addReducers({
    [ACTION_NAME_START]: (global, dispatch) => ({
      [APP_KEY]: {
        ...global[APP_KEY],
        [LOADING_KEY]: true,
      },
    }),
    [ACTION_NAME_ERROR]: (global, dispatch, action, meta) => ({
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
    fetchStart: dispatchers[ACTION_NAME_START],
    fetchError: dispatchers[ACTION_NAME_ERROR],
  };
}

export default fetchReducers;
