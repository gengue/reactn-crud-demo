/**
 * create
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function create(dispatchers, resource) {
  return (formData, sideEffectsCb) => {
    const meta = { resource, intent: 'CREATE' };
    dispatchers.fetchStart({}, meta);
    // send the request
    // e.g. /users?page=1&limit=20
    const url = `https://5d543b8b36ad770014ccd65a.mockapi.io/api/${resource}`;
    // TODO: 1. use our custom fetch to attach token
    // TODO: 2. use our dataProvider to fetch this
    const promise = fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: new Headers({
        'Content-type': 'application/json',
      }),
    });

    promise
      .then(response => response.json())
      .then(
        async function(response) {
          // dispatch the success action
          const newUser = { ...response, ...formData };
          const global = await dispatchers.createSuccess(
            { payload: newUser },
            meta
          );
          // call side effect
          const state = global.vadmin.resources[resource];
          if (sideEffectsCb)
            sideEffectsCb({ success: true, state }, dispatchers);
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
