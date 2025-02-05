import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import getStore from './store';
import { defaults } from './store/defaults';
import { getEnv } from '../tools/getEnv';
import cleanState from '../tools/cleanState';
import type { State } from './store/State';
import { generateDebugImages } from '../tools/generateDebugImages';

const initApp = async () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  let storedSettings: Partial<State>;
  try {
    const lsJson = localStorage.getItem('gbp-web-state');
    storedSettings = JSON.parse(lsJson || '{}') as Partial<State>;
  } catch (error) {
    storedSettings = {};
  }

  if (getEnv()?.env === 'esp8266') {
    storedSettings.printerUrl = '/';
  }

  const initialState: Partial<State> = Object.assign(defaults, storedSettings);

  const { default: App } = await import(/* webpackChunkName: "app" */ './components/App');

  const state = await cleanState(initialState);
  // Write the cleaned state to local storage.
  // This is important because `cleanState` may modify indexedDb entries (e.g. Frames) the initial state relies on.
  localStorage.setItem('gbp-web-state', JSON.stringify(state));

  try {
    const root = createRoot(appRoot);
    const store = getStore(state);
    root.render(<Provider store={store}><App /></Provider>);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.startFake = async (count: number) => {
      await generateDebugImages(store, count);
    };

  } catch (error) {
    const appNode = document.getElementById('app');

    if (appNode) {
      appNode.innerHTML =
        `<p class="init-error">Error while initializing the app:<br>${(error as Error).message}<br><small>${(error as Error).stack}</small></p>`;
    }
  }
};

export default initApp;
