import { UPDATE, APP_KEY } from './../../constants';

/**
 * update
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function update(dispatchers, resource) {
  return (id, formData, sideEffectsCb) => {
    const meta = { resource, intent: UPDATE };
    dispatchers.fetchStart({}, meta);
    // send the request
    // e.g. /users?page=1&limit=20
    const url = `https://5d543b8b36ad770014ccd65a.mockapi.io/api/${resource}/${id}`;
    // TODO: 1. use our custom fetch to attach token
    // TODO: 2. use our dataProvider to fetch this
    const promise = fetch(url, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: new Headers({
        'Content-type': 'application/json',
      }),
    });

    promise
      .then(response => response.json())
      .then(
        async function(response) {
          const record = { ...response, ...formData };
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
