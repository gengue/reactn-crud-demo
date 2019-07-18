/**
 * fetchList
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function fetchList(dispatchers, resource) {
  return (page, limit, replaceExisting) => {
    dispatchers.fetchStart();
    // send the request
    // e.g. /users?page=1&limit=20
    const url = `https://reqres.in/api/${resource}`;
    // TODO: 1. use our custom fetch to attach token
    // TODO: 2. use our dataProvider to fetch this
    const promise = fetch(url, {
      method: 'GET',
      data: {
        page: page || 1,
        limit: limit || 10,
      },
    });

    promise
      .then(response => response.json())
      .then(
        function(response) {
          console.log(response);
          const users = response.data;
          dispatchers.fetchSuccess(
            { payload: users },
            { replace: replaceExisting }
          );
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
