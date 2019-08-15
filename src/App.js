import React, { useEffect, useState, Fragment } from 'react';
import { useGlobal } from 'reactn';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import usersCrud from './users';
import crud from './crud';

class CrudHandlerRegistry {
  constructor() {
    this.memory = {};
  }

  get(resource) {
    return this.memory[resource];
  }

  register(resource, handler) {
    if (!handler) return null;
    this.memory[resource] = handler;
    return this.memory[resource];
  }
}

const crudHandlerRegistry = new CrudHandlerRegistry();

function Resource({
  basePath,
  resource,
  list: List,
  show: Show,
  create: Create,
  edit: Edit,
}) {
  const [crudHandler, setCrudHandler] = useState(
    crudHandlerRegistry.get(resource)
  );

  useEffect(
    () => {
      if (!crudHandler) {
        const handler = crud(resource);
        setCrudHandler(handler);
        crudHandlerRegistry.register(resource, handler);
      }
    },
    [resource, crudHandler]
  );

  if (!crudHandler) return 'Loading...';

  return (
    <Fragment>
      {List && (
        <Route
          exact
          path={`${basePath}${resource}`}
          component={props => <List {...props} crudHandler={crudHandler} />}
        />
      )}
      {Show && (
        <Route
          exact
          path={`${basePath}${resource}/:resourceId/show`}
          component={props => <Show {...props} crudHandler={crudHandler} />}
        />
      )}
      {Edit && (
        <Route
          exact
          path={`${basePath}${resource}/:resourceId/edit`}
          component={props => <Edit {...props} crudHandler={crudHandler} />}
        />
      )}
      {Create && (
        <Route
          exact
          path={`${basePath}${resource}/create`}
          component={props => <Create {...props} crudHandler={crudHandler} />}
        />
      )}
    </Fragment>
  );
}

function HomePage(props) {
  const [admin] = useGlobal('vadmin');
  const resources = admin && admin.resources ? admin.resources : {};
  return (
    <div>
      <h2>All resources</h2>
      {Object.keys(resources).map(i => (
        <div key={i}>
          <Link to={`/${i}`}>{i}</Link>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Resource
            basePath="/"
            resource="users"
            label="Users"
            {...usersCrud}
          />
          <Route component={() => 'No Match'} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
