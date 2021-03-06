import { addReducers, getDispatch } from 'reactn';
import {
  FETCH_START,
  FETCH_ERROR,
  APP_KEY,
  PREFIX,
  LOADING_KEY,
  SAVING_KEY,
  DELETE,
  CREATE,
  UPDATE,
} from './../../constants';

export function fetchReducers() {
  const ACTION_NAME_START = `${PREFIX}${FETCH_START}`;
  const ACTION_NAME_ERROR = `${PREFIX}${FETCH_ERROR}`;

  addReducers({
    [ACTION_NAME_START]: (global, dispatch, action, meta) => {
      let key = LOADING_KEY;
      if (
        meta.intent === DELETE ||
        meta.intent === CREATE ||
        meta.intent === UPDATE
      ) {
        key = SAVING_KEY;
      }
      return {
        [APP_KEY]: {
          ...global[APP_KEY],
          [key]: true,
        },
      };
    },
    [ACTION_NAME_ERROR]: (global, dispatch, action, meta) => {
      let key = LOADING_KEY;
      if (
        meta.intent === DELETE ||
        meta.intent === CREATE ||
        meta.intent === UPDATE
      ) {
        key = SAVING_KEY;
      }
      return {
        [APP_KEY]: {
          ...global[APP_KEY],
          [key]: false,
          resources: {
            [meta.resource]: {
              ...global[APP_KEY].resources[meta.resource],
              error: action.error.toString(),
            },
          },
        },
      };
    },
  });

  const dispatchers = getDispatch();
  return {
    fetchStart: dispatchers[ACTION_NAME_START],
    fetchError: dispatchers[ACTION_NAME_ERROR],
  };
}

export default fetchReducers;
