import { GET_ONE } from './../../constants';
import settings from './../../settings';

/**
 * fetchOne
 * @param {object} dispatchers - all dispatcher functions
 * @param {string} resource - resource name
 * @returns {Function} - return a promise
 */
function fetchOne(dispatchers, resource) {
  return id => {
    const meta = { resource, intent: GET_ONE };
    dispatchers.fetchStart({}, meta);

    const dataProvider = settings.get('dataProvider');
    const promise = dataProvider(GET_ONE, resource, { id });

    promise
      .then(
        function(response) {
          const record = response;
          dispatchers.getOneSuccess({ payload: record, single: true }, meta);
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
