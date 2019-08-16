import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import usersCrud from './pages/users';
import booksCrud from './pages/books';
import HomePage from './pages/HomePage';
import Layout from './Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          {usersCrud.routes}
          {booksCrud.routes}
          <Route component={() => 'No Match'} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
