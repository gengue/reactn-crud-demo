import React, { setGlobal } from 'reactn';
import addReactNDevTools from 'reactn-devtools';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

addReactNDevTools();

setGlobal({
  cards: [
    {
      id: 1,
      name: 'Robert Smith',
    },
    {
      id: 2,
      name: 'Catalina Robinson',
    },
  ],
  showLogo: true,
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
