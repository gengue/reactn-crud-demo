/**
 * update
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function create(dispatchers, resource) {
  return (id, formData) => {
    dispatchers.updateStart();
    // send the request
    // e.g. /users?page=1&limit=20
    const url = `https://reqres.in/api/${resource}/${id}`;
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
        function(response) {
          console.log(response);
          const newUser = { ...response, ...formData };
          dispatchers.updateSuccess({ payload: newUser });
        },
        function(response) {
          // dispatch the error action
          dispatchers.updateError({ error: response });
        }
      )
      .catch(function(err) {
        console.error(err.toString());
      });

    return promise;
  };
}

export default create;
