# Reactn CRUD

A frontend example for building CRUD pages running on top of REST/GraphQL APIs, using Es6, [React](https://facebook.github.io/react/), [reactn](https://github.com/CharlesStover/reactn), [react-router](https://reacttraining.com/react-router/) and [Antd Design](https://ant.design/docs/react/introduce). 

Heavly inspired in [react-admin](https://marmelab.com/react-admin/)

[Demo](http://reactn-crud.surge.sh/) 

## At a Glance

First, setup the [dataProvider](https://github.com/marmelab/react-admin#does-it-work-with-my-api) to make compatible with your REST service.

```jsx
// in index.js
import { settings as crudSettings } from './crud';
// set data provider
crudSettings.set('dataProvider', dataProvider);
```

Creating a crud for users

```jsx
// in users/index.js
import crud from './../../crud';
import { ListController, ShowController,FormController } from './../../crud/ui';

function UserList(props) {
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      primary: true,
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      sorter: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      sorter: true,
    },
  ];
  return (
    <ListController
      {...props}
      resource="users"
      columns={columns}
    />
  );
}

function UserShow(props) {
  const fields = [
    {
      dataIndex: 'email',
      title: 'Email',
    },
    {
      dataIndex: 'name',
      title: 'Full name',
      render: record => `${record.first_name} ${record.last_name}`,
    },
  ];
  return <ShowController {...props} fields={fields} resource="users" />;
}

function UserForm(props) {
  return (
    <FormController {...props} resource="users">
      <Input source="email" label="Email" type="email" required />
      <Input source="first_name" label="First Name" required />
      <Input source="last_name" label="Last Name" required />
    </FormController>
  );
}

const config = {
  components: {
    List: UserList,
    Create: UserForm,
    Edit: UserForm,
    Show: UserShow,
  },
};
const { routes } = crud('users', config);
export default routes;
```

Importing your routes

```jsx
// in App.js
import usersRoutes from './users';

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          {usersRoutes}
          <Route component={() => 'No Match'} />
        </Switch>
      </Layout>
    </Router>
  );
}
```

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.
Your app is ready to be deployed!

## Development

Currently is just an experiment, hope get a stable version to publish as a full Framework on NPM. The goal is get a "reactn-admin" with a plugin system to support multiple UI libraries (not just antd-design)

### TODO
- Add all prop-types to components
- Add unit tests
- Add form validation support
- Async resource injection and code split 

## License

Reactn-crud is licensed under the [MIT License](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), sponsored and supported by [Ventura TRAVEL OS](https://github.com/ventura-open-source).

