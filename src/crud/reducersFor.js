import { PREFIX } from './constants';
//import fetchReducersList from './reducers/list/fetch';
//import createReducersList from './reducers/list/create';
//import updateReducersList from './reducers/list/update';
import fetchReducers from './reducers/map/fetch';
import createReducers from './reducers/map/create';
import updateReducers from './reducers/map/update';
import deleteReducers from './reducers/map/delete';
import filterReducers from './reducers/filters';

/**
 * reducersFor
 * @param {string} resource
 * @param {object} config
 * @returns {object} - object of dispatcher functions
 */
export function reducersFor(resource, config) {
  const NAMESPACE = PREFIX + resource.toUpperCase();

  //let fetchReducers = fetchReducersMap;
  //let createReducers = createReducersMap;
  //let updateReducers = updateReducersMap;

  //if (config.type === 'list') {
  //fetchReducers = fetchReducersList;
  //createReducers = createReducersList;
  //updateReducers = updateReducersList;
  //}

  const fetchDispachers = fetchReducers(NAMESPACE, resource, config);
  const createDispachers = createReducers(NAMESPACE, resource, config);
  const updateDispachers = updateReducers(NAMESPACE, resource, config);
  const deleteDispachers = deleteReducers(NAMESPACE, resource, config);
  const filterDispachers = filterReducers(resource, config);
  return {
    ...fetchDispachers,
    ...createDispachers,
    ...updateDispachers,
    ...deleteDispachers,
    ...filterDispachers,
  };
}

export default reducersFor;
