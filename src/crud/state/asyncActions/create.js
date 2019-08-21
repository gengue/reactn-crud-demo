import { CREATE } from './../../constants';
import settings from './../../settings';

/**
 * create
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function create(dispatchers, resource) {
  return (data, sideEffectsCb) => {
    const meta = { resource, intent: CREATE };
    dispatchers.fetchStart({}, meta);

    const dataProvider = settings.get('dataProvider');
    const promise = dataProvider(CREATE, resource, { data });

    promise
      .then(
        async function(response) {
          // dispatch the success action
          const record = { ...response, ...data };
          const global = await dispatchers.createSuccess(
            { payload: record },
            meta
          );
          // call side effect
          const state = global.vadmin.resources[resource];
          if (sideEffectsCb)
            sideEffectsCb({ success: true, state, record }, dispatchers);
        },
        async function(error) {
          // dispatch the error action
          const global = await dispatchers.createError({ error }, meta);
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

export default create;
