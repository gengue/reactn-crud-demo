import {
  useState,
  setGlobal,
  useGlobal,
  addReducer,
  useDispatch,
  getDispatch,
} from 'reactn';

addReducer('USERS_FETCH_START', (global, dispatch, action) => {
  return {
    users: {
      ...global.users,
      busy: true,
    },
  };
});

addReducer('USERS_FETCH_SUCCESS', (global, dispatch, action) => {
  return {
    users: {
      ...global.users,
      busy: false,
      data: action.data,
      records: action.payload,
    },
  };
});

addReducer('USERS_FETCH_ERROR', (global, dispatch, action) => {
  return {
    users: {
      ...global.users,
      busy: false,
      data: action.data,
      error: action.error,
    },
  };
});
