import React from 'react';
import addReactNDevTools from 'reactn-devtools';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { mockApiClient } from './dataProvider';
import { settings as crudSettings } from './crud';
import './index.css';
import 'antd/dist/antd.css';

const dataProvider = mockApiClient(
  'https://5d543b8b36ad770014ccd65a.mockapi.io/api'
);
// set data provider
crudSettings.set('dataProvider', dataProvider);
// redux dev tools
addReactNDevTools();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
serviceWorker.register();
