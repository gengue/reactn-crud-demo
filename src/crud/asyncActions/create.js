/**
 * create
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function create(dispatchers, resource) {
  return formData => {
    dispatchers.createStart();
    // send the request
    // e.g. /users?page=1&limit=20
    const url = `https://reqres.in/api/${resource}`;
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
        function(response) {
          const newUser = { ...response, ...formData };
          dispatchers.createSuccess({ payload: newUser });
        },
        function(response) {
          // dispatch the error action
          dispatchers.createError({ error: response });
        }
      )
      .catch(function(err) {
        console.error(err.toString());
      });

    return promise;
  };
}

export default create;
