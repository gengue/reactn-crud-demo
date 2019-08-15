/**
 * fetchOne
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function fetchOne(dispatchers, resource) {
  return id => {
    const meta = { resource, intent: 'GET_ONE' };
    dispatchers.fetchStart({}, meta);
    // send the request
    // e.g. /users?page=1&limit=20
    const url = `https://5d543b8b36ad770014ccd65a.mockapi.io/api/${resource}/${id}`;
    // TODO: 1. use our custom fetch to attach token
    // TODO: 2. use our dataProvider to fetch this
    const promise = fetch(url);

    promise
      .then(response => response.json())
      .then(
        function(response) {
          const user = response;
          dispatchers.getOneSuccess({ payload: user, single: true }, meta);
        },
        function(response) {
          // dispatch the error action
          dispatchers.fetchError({ error: response }, meta);
        }
      )
      .catch(function(err) {
        console.error(err.toString());
      });

    return promise;
  };
}

export default fetchOne;
