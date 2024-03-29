import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import getStore from './store';
import { defaults } from './store/defaults';
import { getEnv } from '../tools/getEnv';
import cleanState from '../tools/cleanState';

const initApp = () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  let storedSettings;
  try {
    storedSettings = JSON.parse(localStorage.getItem('gbp-web-state')) || {};
  } catch (error) {
    storedSettings = {};
  }

  if (getEnv().env === 'esp8266') {
    storedSettings.printerUrl = '/';
  }

  const initialState = Object.assign(defaults, storedSettings);

  import(/* webpackChunkName: "app" */ './components/App')
    .then(({ default: App }) => {
      cleanState(initialState)
        .then((state) => {
          // Write the cleaned state to local storage.
          // This is important because `cleanState` may modify indexedDb entries (e.g. Frames) the initial state relies on.
          localStorage.setItem('gbp-web-state', JSON.stringify(state));

          try {
            const store = getStore(state);
            render(<Provider store={store}><App /></Provider>, appRoot);
          } catch (error) {
            document.getElementById('app')
              .innerHTML = `<p class="init-error">Error while initializing the app:<br>${error.message}<br><small>${error.stack}</small></p>`;
          }
        });
    });

};

export default initApp;
