import { getGlobal, setGlobal } from 'reactn';
import { DEFAULT_CONFIG, APP_KEY, getDefaultResourceState } from './constants';
import reducersFor from './reducersFor';
import { fetchList, fetchOne, create, update } from './asyncActions';

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
  const admin = getGlobal()[APP_KEY];

  // initialize admin schema
  if (!admin) {
    setGlobal({
      [APP_KEY]: {
        resources: {
          ...getDefaultResourceState(resource, config.props),
        },
        loading: false,
        saving: false,
      },
    });
  } else {
    const resourceState = admin.resources[resource];
    // initialize resource default state
    if (!resourceState) {
      setGlobal({
        [APP_KEY]: {
          ...admin,
          resources: {
            ...admin.resources,
            ...getDefaultResourceState(resource, config.props),
          },
        },
      });
    } else {
      console.warn('Resource already exists');
    }
  }

  return {
    fetchList: fetchList(dispatchers, resource),
    fetchOne: fetchOne(dispatchers, resource),
    create: create(dispatchers, resource),
    update: update(dispatchers, resource),
  };
}

export default crudFor;
