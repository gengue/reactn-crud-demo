import queryString from 'query-string';

/**
 * fetchList
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function fetchList(dispatchers, resource) {
  return (params = {}, replaceExisting) => {
    dispatchers.fetchStart();
    // send the request
    // e.g. /users?page=1&limit=20

    const query = queryString.stringify({
      page: params.page || 1,
      limit: params.perPage || 10,
    });
    const url = `https://5d543b8b36ad770014ccd65a.mockapi.io/api/${resource}?${query}`;
    // TODO: 1. use our custom fetch to attach token
    // TODO: 2. use our dataProvider to fetch this
    const promise = fetch(url, { method: 'GET' });
    promise
      .then(response => response.json())
      .then(
        function(response) {
          const users = response.data;
          const action = {
            payload: users,
            single: false,
            params,
            total: response.total,
          };
          const meta = { replace: replaceExisting };
          dispatchers.fetchSuccess(action, meta);
        },
        function(response) {
          // dispatch the error action
          dispatchers.fetchError({ error: response });
        }
      )
      .catch(function(err) {
        console.error(err.toString());
      });

    return promise;
  };
}

export default fetchList;
