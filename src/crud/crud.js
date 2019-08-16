import state from './state';
import routesFor from './routesFor';
import { getConfig } from './utils';

/**
 * crud
 * @param {string} resource
 * @param {object} config - resource fongi
 * @returns {object} - object with routes and actions
 */
export function crud(resource, config) {
  const setup = getConfig(resource, config);
  const actions = state(resource, setup);
  const routes = routesFor(resource, actions, setup);

  return {
    actions,
    routes,
  };
}

export default crud;
