//import Auth from './Auth';
import axios from 'axios';

class AuthHelper {
  getToken() {
    return null;
  }
}
const Auth = new AuthHelper();

export const fetchJson = (url, options = {}) => {
  const requestHeaders = options.headers || { Accept: 'application/json' };

  let accessToken = Auth.getToken();

  if (
    !requestHeaders['Content-Type'] &&
    !(options && options.body && options.body instanceof FormData)
  ) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (accessToken) {
    requestHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  return axios({
    url,
    baseURL: `${process.env.REACT_APP_API_URL}/`,
    headers: requestHeaders,
    ...options,
  }).then(response => {
    const { status, statusText, headers, data: json } = response;
    if (status < 200 || status >= 300) {
      return Promise.reject(
        new HttpError((json && json.message) || statusText, status, json)
      );
    }
    return Promise.resolve({ status, headers, json });
  });
};

export class HttpError extends Error {
  constructor(message, status, body = null) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
    this.stack = new Error().stack;
  }
}

export default fetchJson;
