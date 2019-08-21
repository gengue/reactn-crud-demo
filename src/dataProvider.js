import { stringify } from 'query-string';
import fetchJson from './utils/fetchJson';
import { GET_LIST, GET_ONE, CREATE, UPDATE, DELETE } from './crud';

const parseQuery = v => stringify(v, { arrayFormat: 'bracket' });

/**
 * mockApiClient
 * @desc Maps reactn-crudi queries to a (slightly modified) mockapi.io powered REST API
 *
 * @example
 * GET_LIST     => GET http://my.api.url/posts?sortBy=title&order=desc&page=1&limit=10
 * GET_ONE      => GET http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * UPDATE       => PUT http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export const mockApiClient = (apiUrl, httpClient = fetchJson) => {
  /**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The REST request params, depending on the type
   * @returns {Object} { url, options } The HTTP request parameters
   */
  const convertRESTRequestToHTTP = (type, resource, params) => {
    let url = '';
    const options = {};

    switch (type) {
      case GET_LIST: {
        const { search, page, perPage, sort, order } = params;
        const query = {
          page: page || 1,
          limit: perPage || 10,
          search,
          sortBy: sort,
          order: order ? order.toLowerCase() : order,
          ...params.filter,
        };

        url = `${apiUrl}/${resource}?${parseQuery(query)}`;
        break;
      }
      case GET_ONE:
        url = `${apiUrl}/${resource}/${params.id}`;
        break;
      case UPDATE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'PUT';
        options.body = JSON.stringify(params.data);
        break;
      case CREATE:
        url = `${apiUrl}/${resource}`;
        options.method = 'POST';
        options.body = JSON.stringify(params.data);
        break;
      case DELETE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'DELETE';
        break;
      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
    return { url, options };
  };

  /**
   * @param {Object} response HTTP response from fetch()
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The REST request params, depending on the type
   * @returns {Object} REST response
   */
  const convertHTTPResponseToREST = (response, type, resource, params) => {
    const { json } = response;
    switch (type) {
      case GET_LIST:
        return json;
      case CREATE:
        return json;
      case DELETE:
        return json;
      default:
        return json;
    }
  };

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a REST response
   */
  return (type, resource, params) => {
    const { url, options } = convertRESTRequestToHTTP(type, resource, params);
    return httpClient(url, options).then(response =>
      convertHTTPResponseToREST(response, type, resource, params)
    );
  };
};

export default mockApiClient(process.env.REACT_APP_API_URL, fetchJson);
