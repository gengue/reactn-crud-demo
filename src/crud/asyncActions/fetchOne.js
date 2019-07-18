/**
 * fetchList
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function fetchOne(dispatchers, resource) {
  return id => {
    dispatchers.fetchStart();
    // send the request
    // e.g. /users?page=1&limit=20
    const url = `https://reqres.in/api/${resource}/${id}`;
    // TODO: 1. use our custom fetch to attach token
    // TODO: 2. use our dataProvider to fetch this
    const promise = fetch(url);

    promise
      .then(response => response.json())
      .then(
        function(response) {
          console.log(response);
          const user = response.data;
          dispatchers.fetchSuccess({ payload: user });
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

export default fetchOne;
