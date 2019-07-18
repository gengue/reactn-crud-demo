import {
  useState,
  setGlobal,
  useGlobal,
  addReducer,
  useDispatch,
  getDispatch,
} from 'reactn';
export const actionTypes = {
  USERS_FETCH_START: 'USERS_FETCH_START',
  USERS_FETCH_SUCCESS: 'USERS_FETCH_SUCCESS',
  USERS_FETCH_ERROR: 'USERS_FETCH_ERROR',

  USERS_UPDATE_START: 'USERS_UPDATE_START',
  USERS_UPDATE_SUCCESS: 'USERS_UPDATE_SUCCESS',
  USERS_UPDATE_ERROR: 'USERS_UPDATE_ERROR',

  USERS_CREATE_START: 'USERS_CREATE_START',
  USERS_CREATE_SUCCESS: 'USERS_CREATE_SUCCESS',
  USERS_CREATE_ERROR: 'USERS_CREATE_ERROR',

  USERS_DELETE_START: 'USERS_DELETE_START',
  USERS_DELETE_SUCCESS: 'USERS_DELETE_SUCCESS',
  USERS_DELETE_ERROR: 'USERS_DELETE_ERROR',

  // Object also contains shortcuts

  fetchStart: 'USERS_FETCH_START',
  fetchSuccess: 'USERS_FETCH_SUCCESS',
  fetchError: 'USERS_FETCH_ERROR',

  updateStart: 'USERS_UPDATE_START',
  updateSuccess: 'USERS_UPDATE_SUCCESS',
  updateError: 'USERS_UPDATE_ERROR',

  createStart: 'USERS_CREATE_START',
  createSuccess: 'USERS_CREATE_SUCCESS',
  createError: 'USERS_CREATE_ERROR',

  deleteStart: 'USERS_DELETE_START',
  deleteSuccess: 'USERS_DELETE_SUCCESS',
  deleteError: 'USERS_DELETE_ERROR',
};

export const actionCreators = {
  fetchStart: function(data) {
    return {
      data: data,
      type: 'USERS_FETCH_START',
    };
  },

  /*
  If data.replace is true, existing records in the store will
  be replaced instead of merged.
  */
  fetchSuccess: function(users, data) {
    return {
      data: data,
      records: users,
      type: 'USERS_FETCH_SUCCESS',
    };
  },

  fetchError: function(error, data) {
    return {
      data: data,
      error: error,
      type: 'USERS_FETCH_ERROR',
    };
  },

  /*
  The user record must have a client generated key
  so it can be inserted in the collection optimistically.
  */
  createStart: function(user, data) {
    return {
      data: data,
      record: user,
      type: 'USERS_CREATE_START',
    };
  },

  createSuccess: function(user, data) {
    return {
      data: data,
      record: user,
      type: 'USERS_CREATE_SUCCESS',
    };
  },

  /*
  The user record must have the client generated key
  so it can be matched with the record inserted optimistically.
  */
  createError: function(error, user, data) {
    return {
      data: data,
      error: error,
      record: user,
      type: 'USERS_CREATE_ERROR',
    };
  },

  updateStart: function(user, data) {
    return {
      data: data,
      record: user,
      type: 'USERS_UPDATE_START',
    };
  },

  updateSuccess: function(user, data) {
    return {
      data: data,
      record: user,
      type: 'USERS_UPDATE_SUCCESS',
    };
  },

  updateError: function(error, user, data) {
    return {
      data: data,
      error: error,
      record: user,
      type: 'USERS_UPDATE_ERROR',
    };
  },

  deleteStart: function(user, data) {
    return {
      data: data,
      record: user,
      type: 'USERS_DELETE_START',
    };
  },

  deleteSuccess: function(user, data) {
    return {
      data: data,
      record: user,
      type: 'USERS_DELETE_SUCCESS',
    };
  },

  deleteError: function(error, user, data) {
    return {
      data: data,
      error: error,
      record: user,
      type: 'USERS_DELETE_ERROR',
    };
  },
};

// los async

export function fetchUsers(page, limit, replaceExisting) {
  const {
    USERS_FETCH_START: fetchStart,
    USERS_FETCH_SUCCESS: fetchSuccess,
    USERS_FETCH_ERROR: fetchError,
  } = getDispatch();
  fetchStart();

  // send the request
  // e.g. /users?page=1&limit=20
  const url = `https://reqres.in/api/users`;
  // TODO: 1. use our custom fetch to attach token
  // TODO: 2. use our dataProvider to fetch this
  const promise = fetch(url, {
    method: 'GET',
    data: {
      page: page || 1,
      limit: limit || 10,
    },
  });

  promise
    .then(response => response.json())
    .then(
      function(response) {
        console.log(response);
        const users = response.data;
        fetchSuccess({ payload: users });
      },
      function(response) {
        // dispatch the error action
        fetchError({ error: response });
      }
    )
    .catch(function(err) {
      console.error(err.toString());
    });

  return promise;
}

window.fetchUsers = fetchUsers;

export default { actionTypes, actionCreators, fetchUsers };
