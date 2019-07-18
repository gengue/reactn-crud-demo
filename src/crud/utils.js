import isArray from 'lodash/isArray';
import has from 'lodash/has';

/**
 * capitalCase
 * @param {string} s
 * @returns {string}
 */
export function snakeToCamel(s) {
  return s.replace(/(_\w)/g, function(m) {
    return m[1].toUpperCase();
  });
}

/**
 * capitalCase
 * @param {string} string
 * @returns {string}
 */
export function capitalCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * getPrettyFuncName
 * @example getPrettyFuncName('user_reviews ') => 'fetchUserReview'
 * @param {string} action
 * @param {string} resource
 * @returns {string}
 */
export function getPrettyFuncName(action, resource) {
  return action + capitalCase(snakeToCamel(resource));
}

/**
 * wrapArray
 * @param {any} recordOrRecords
 * @returns {boolean}
 */
export function wrapArray(recordOrRecords) {
  return isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords];
}

/**
 * assertHasKey
 * @param {object} config
 * @param {string} scope
 * @param {any} recordOrRecords
 */
export function assertHasKey(config, scope, recordOrRecords) {
  let key = config.key;
  let records = wrapArray(recordOrRecords);
  records.forEach(function(record) {
    if (record[key] == null) {
      throw new Error(scope + ': Expected record to have .' + key);
    }
  });
}

/**
 * assertAllHaveKeys
 * @param {object} config
 * @param {string} reducerName
 * @param {array} records
 */
export function assertAllHaveKeys(config, reducerName, records) {
  // All given records must have a key
  const allKeys = records.every(i => has(i, config.key));

  if (!allKeys) {
    throw new Error(
      reducerName +
        ": Expected all records to have a value for the store's key `" +
        config.key +
        '`'
    );
  }
}
