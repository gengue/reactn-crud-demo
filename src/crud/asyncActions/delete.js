/**
 * deleteResource
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function deleteResource(dispatchers, resource) {
  return (id, sideEffectsCb) => {
    dispatchers.deleteStart();
    // send the request
    // e.g. /users?page=1&limit=20
    const url = `https://5d543b8b36ad770014ccd65a.mockapi.io/api/${resource}/${id}`;
    // TODO: 1. use our custom fetch to attach token
    // TODO: 2. use our dataProvider to fetch this
    const promise = fetch(url, { method: 'DELETE' });

    promise
      .then(
        async function(response) {
          const global = await dispatchers.deleteSuccess({ payload: id });
          // call side effect
          const state = global.vadmin.resources[resource];
          if (sideEffectsCb)
            sideEffectsCb({ success: true, state }, dispatchers);
        },
        async function(error) {
          // dispatch the error action
          const global = await dispatchers.deleteError({ error });
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
