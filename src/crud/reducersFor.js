import { PREFIX } from './constants';
import fetchReducers from './reducers/list/fetch';
import createReducers from './reducers/list/create';

/**
 * reducersFor
 * @param {string} resource
 * @param {object} config
 * @returns {object} - object of dispatcher functions
 */
export function reducersFor(resource, config) {
  const NAMESPACE = PREFIX + resource.toUpperCase();
  // TODO: get reducers from list or map based on config
  const fetchDispachers = fetchReducers(NAMESPACE, resource, config);
  const createDispachers = createReducers(NAMESPACE, resource, config);
  return {
    ...fetchDispachers,
    ...createDispachers,
  };
}

export default reducersFor;
