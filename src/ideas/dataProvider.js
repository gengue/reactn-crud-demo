/**
 * Epilogue adapter for ventura-admin.
 * Based off of:
 * https://github.com/dunghuynh/aor-epilogue-client/blob/master/src/index.js
 */

import { stringify } from 'query-string';
import fetchJson from 'utils/fetchJson';
import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
} from 'state/crud/actions';

const parseQuery = v => stringify(v, { arrayFormat: 'bracket' });

/**
 * Get API ulr from resource name
 * @param {String} resource
 * @param {Array} withReplaceValue - if it's present, replaceWithValueFromSource
 * funnction will be applied using the array values as param
 * @returns {String}
 */
export const apiUrlMapping = (resource, withReplaceValue = null) => {
  //const userId = JSON.parse(localStorage.getItem('user')).id;
  const urlMap = {
    users: 'users/v1/users',
    'users-cached': 'users/v1/users-cached',
    'quarterly-reviews': 'users/v1/quarter_reviews',
    permissions: 'users/v1/me/perms',
    groups: 'users/v1/groups',
    projects: 'users/v1/projects',
    locales: 'incoming/v1/locales',
    organisations: 'users/v1/organisations',
    incomings: 'incoming/v1/incomings',
  };
  const result = urlMap[resource];
  return result;
};

/**
 * Maps admin-on-rest queries to a (slightly modified) epilogue powered REST API
 *
 * @see https://github.com/dchester/epilogue
 * @example
 *
 * GET_LIST     => GET http://my.api.url/posts?sort=-title&page=0&count=10
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts/?id=123&id=456&id=789
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export const epilogueClient = (apiUrl, httpClient) => {
  /**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The REST request params, depending on the type
   * @returns {Object} { url, options } The HTTP request parameters
   */
  const convertRESTRequestToHTTP = (type, resource, params) => {
    let url = '';
    const options = {};
    const sortValue = ({ field, order }) => {
      return order === 'DESC' ? `-${field}` : field;
    };
    if (type === GET_MANY) {
      params.filter = params.filter || {};
      params.filter.ids = params.ids;
    }
    switch (type) {
      case GET_LIST: {
        const { page, perPage } = params.pagination;
        const query = {
          ...params.filter,
          sort: sortValue(params.sort),
          page: page - 1,
          count: perPage,
        };
        if (resource === 'users') {
          // use cached users endpoint for LIST action
          resource = 'users-cached';
        }
        url = `${apiUrl}/${apiUrlMapping(resource)}?${parseQuery(query)}`;
        break;
      }
      case GET_ONE:
        url = `${apiUrl}/${apiUrlMapping(resource)}/${params.id}`;
        break;
      case GET_MANY: {
        const query = {
          id: params.ids,
        };
        if (resource === 'users') {
          // use cached users endpoint for LIST action
          resource = 'users-cached';
        }
        url = `${apiUrl}/${apiUrlMapping(resource)}?${parseQuery(query)}`;
        break;
      }
      case GET_MANY_REFERENCE: {
        const { page, perPage } = params.pagination;
        const query = {
          ...params.filter,
          [params.target]: params.id,
          sort: sortValue(params.sort),
          page: page - 1,
          count: perPage,
        };
        url = `${apiUrl}/${apiUrlMapping(resource)}?${parseQuery(query)}`;
        break;
      }
      case UPDATE:
        url = `${apiUrl}/${apiUrlMapping(resource)}/${params.id}`;
        options.method = 'PUT';
        options.body = JSON.stringify(params.data);
        break;
      case CREATE:
        url = `${apiUrl}/${apiUrlMapping(resource)}`;
        options.method = 'POST';
        options.body = JSON.stringify(params.data);
        break;
      case DELETE:
        url = `${apiUrl}/${apiUrlMapping(resource)}/${params.id}`;
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
    const { headers, json } = response;
    switch (type) {
      case GET_LIST:
      case GET_MANY:
      case GET_MANY_REFERENCE:
        const headerName = 'Content-Range';
        if (!headers.has(headerName)) {
          throw new Error(
            `The ${headerName} header is missing in the HTTP Response.
            The jsonServer REST client expects responses for lists of resources
            to contain this header with the total number of results to build the
            pagination. If you are using CORS, did you declare ${headerName} in
            the Access-Control-Expose-Headers header?
            Example ${headerName} value: items 0-9/100`
          );
        }
        const total = parseInt(
          headers
            .get(headerName)
            .split('/')
            .pop(),
          10
        );
        return {
          data: json,
          total,
        };
      case CREATE:
        return { data: { ...params.data, id: json.id } };
      case DELETE:
        return { data: { id: -1 } };
      default:
        return { data: json };
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

export default epilogueClient(process.env.REACT_APP_API_URL, fetchJson);
