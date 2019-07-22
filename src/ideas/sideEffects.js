import { addReducer, getGlobal, getDispatch, setGlobal } from 'reactn';
import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
  RESOURCE_REQUEST,
  RESOURCE_SUCCESS,
  RESOURCE_FAILURE,
  FETCH_START,
  FETCH_END,
  FETCH_ERROR,
  FETCH_CANCEL,
} from './actions';
import dataProvider from './../../dataProvider';

const validateResponseFormat = () => true;
const put = () => true;
const all = () => true;
const call = () => true;
const cancelled = () => true;

export function* handleFetch(dataProvider, action) {
  const {
    type,
    payload,
    meta: { fetch: fetchMeta, onSuccess, onFailure, ...meta },
  } = action;
  const restType = fetchMeta;

  try {
    yield all([
      put({ type: `${type}_LOADING`, payload, meta }),
      put({ type: FETCH_START }),
    ]);
    const response = yield call(dataProvider, restType, meta.resource, payload);
    if (process.env.NODE_ENV !== 'production') {
      validateResponseFormat(response, restType);
    }
    yield put({
      type: `${type}_SUCCESS`,
      payload: response,
      requestPayload: payload,
      meta: {
        ...meta,
        ...onSuccess,
        fetchResponse: restType,
        fetchStatus: FETCH_END,
      },
    });
    yield put({ type: FETCH_END });
  } catch (error) {
    yield put({
      type: `${type}_FAILURE`,
      error: error.message ? error.message : error,
      payload: error.body ? error.body : null,
      requestPayload: payload,
      meta: {
        ...meta,
        ...onFailure,
        fetchResponse: restType,
        fetchStatus: FETCH_ERROR,
      },
    });
    yield put({ type: FETCH_ERROR, error });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_CANCEL });
      return;
    }
  }
}
