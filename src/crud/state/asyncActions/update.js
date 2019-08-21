import { UPDATE, APP_KEY } from './../../constants';
import settings from './../../settings';

/**
 * update
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function update(dispatchers, resource) {
  return (id, data, sideEffectsCb) => {
    const meta = { resource, intent: UPDATE };
    dispatchers.fetchStart({}, meta);

    const dataProvider = settings.get('dataProvider');
    const promise = dataProvider(UPDATE, resource, { id, data });

    promise
      .then(
        async function(response) {
          const record = { ...response, ...data };
          const global = await dispatchers.updateSuccess(
            { payload: record },
            meta
          );
          // call side effects
          const state = global[APP_KEY].resources[resource];
          if (sideEffectsCb)
            sideEffectsCb({ success: true, state, record }, dispatchers);
        },
        async function(error) {
          // dispatch the error action
          const global = await dispatchers.fetchError({ error }, meta);
          // call side effects
          const state = global[APP_KEY].resources[resource];
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

export default update;
