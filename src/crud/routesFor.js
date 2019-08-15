import React from 'react';
import { Route } from 'react-router-dom';

/**
 * routesFor
 * @param {string} resource
 * @param {Object} actions - object of functions (async actions)
 * @param {object} config
 * @returns {Array} - react-router Routes
 */
export function routesFor(resource, actions, config) {
  const { basePath, hasList, hasShow, hasCreate, hasEdit } = config;
  const { List, Show, Edit, Create } = config.components;
  const routes = [
    hasList && (
      <Route
        key={`${resource}-crud-list`}
        exact
        path={`${basePath}${resource}`}
        component={props => <List {...props} crudHandler={actions} />}
      />
    ),
    hasShow && (
      <Route
        key={`${resource}-crud-show`}
        exact
        path={`${basePath}${resource}/:resourceId/show`}
        component={props => <Show {...props} crudHandler={actions} />}
      />
    ),
    hasEdit && (
      <Route
        key={`${resource}-crud-edit`}
        exact
        path={`${basePath}${resource}/:resourceId/edit`}
        component={props => <Edit {...props} crudHandler={actions} />}
      />
    ),
    hasCreate && (
      <Route
        key={`${resource}-crud-create`}
        exact
        path={`${basePath}${resource}/create`}
        component={props => <Create {...props} crudHandler={actions} />}
      />
    ),
  ];
  return routes.filter(i => i !== false);
}

export default routesFor;
