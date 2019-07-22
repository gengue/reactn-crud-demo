import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import usersCrud from './users';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={usersCrud.list} />
          <Route exact path="/users/:userId/show" component={usersCrud.show} />
          <Route exact path="/users/:userId/edit" component={usersCrud.form} />
          <Route exact path="/users/create" component={usersCrud.form} />
          <Route component={() => 'No Match'} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
