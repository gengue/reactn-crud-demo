import { DELETE } from './../../constants';
import settings from './../../settings';

/**
 * deleteResource
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function deleteResource(dispatchers, resource) {
  return (id, sideEffectsCb) => {
    const meta = { resource, intent: DELETE };
    dispatchers.fetchStart({}, meta);

    const dataProvider = settings.get('dataProvider');
    const promise = dataProvider(DELETE, resource, { id });

    promise
      .then(
        async function(response) {
          const global = await dispatchers.deleteSuccess({ payload: id }, meta);
          // call side effect
          const state = global.vadmin.resources[resource];
          if (sideEffectsCb)
            sideEffectsCb({ success: true, state }, dispatchers);
        },
        async function(error) {
          // dispatch the error action
          const global = await dispatchers.deleteError({ error }, meta);
          // call side effect
          const state = global.vadmin.resources[resource];
          if (sideEffectsCb)
            sideEffectsCb({ success: false, state, error }, dispatchers);
        }
      )
      .catch(function(err) {
        console.error(err.toString());
      });

    return promise;
  };
}

export default deleteResource;
