import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import getStore from './store';
import defaults from './store/defaults';

const initApp = () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  let storedSettings;
  try {
    storedSettings = JSON.parse(localStorage.getItem('gbp-web-state'));
  } catch (error) {
    storedSettings = {};
  }

  const initialState = Object.assign(defaults, storedSettings);

  import(/* webpackChunkName: "app" */ './components/App')
    .then(({ default: App }) => {
      render(<Provider store={getStore(initialState)}><App /></Provider>, appRoot);
    });

};

export default initApp;
