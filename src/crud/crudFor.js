import { DEFAULT_CONFIG } from './constants';
import reducersFor from './reducersFor';
import { fetchList, fetchOne, create } from './asyncActions';

/**
 * crudFor
 * @example
 *  const users = crudFor('users');
 *  users.fetchUsers();
 * @param {string} resource - name
 * @param {object} config - options to setup the reducers
 * @returns {object} - object of functions (action creators)
 */
export function crudFor(resource, config = DEFAULT_CONFIG) {
  const dispatchers = reducersFor(resource, config);

  return {
    fetchList: fetchList(dispatchers, resource),
    fetchOne: fetchOne(dispatchers, resource),
    create: create(dispatchers, resource),
  };
}

export default crudFor;
