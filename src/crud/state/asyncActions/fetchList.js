import queryString from 'query-string';
import { GET_LIST } from './../../constants';

/**
 * fetchList
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function fetchList(dispatchers, resource) {
  return (params = {}, replaceExisting) => {
    const meta = { replace: replaceExisting, resource, intent: GET_LIST };
    dispatchers.fetchStart({}, meta);
    // send the request
    // e.g. /users?page=1&limit=20

    const query = queryString.stringify({
      page: params.page || 1,
      limit: params.perPage || 10,
      search: params.search,
      sortBy: params.sort,
      order: params.order,
    });
    const url = `https://5d543b8b36ad770014ccd65a.mockapi.io/api/${resource}?${query}`;
    // TODO: 1. use our custom fetch to attach token
    // TODO: 2. use our dataProvider to fetch this
    const promise = fetch(url, { method: 'GET' });
    promise
      .then(response => response.json())
      .then(
        function(response) {
          const payload = response.data;
          const action = {
            payload,
            single: false,
            params,
            total: response.total,
          };
          dispatchers.getListSuccess(action, meta);
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

export default fetchList;
