import { resourceRegistry, createFetch } from './resourcesDuck';
import fetchJson from 'utils/fetchJson';

export const RESOURCE = 'users';

// initialize module
resourceRegistry.register(RESOURCE);

export function getUsers(aja) {
  return fetchJson(`users/v1/users`);
}

// Action creators
export function load(id) {
  return createFetch(RESOURCE, getUsers, id);
}

// Selectors
export function selectUser(state) {
  return state.resource[RESOURCE].data;
}
//export function selectFetching(state) {
//return state[RESOURCE].fetching;
//}
export function selectError(state) {
  return state[RESOURCE].error;
}
