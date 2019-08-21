import { GET_LIST } from './../../constants';
import settings from './../../settings';

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

    const dataProvider = settings.get('dataProvider');
    const promise = dataProvider(GET_LIST, resource, params);
    promise
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
