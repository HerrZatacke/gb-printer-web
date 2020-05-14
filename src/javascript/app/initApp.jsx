import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './components/App';
import getStore from './store';
import defaults from './defaults';

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

  // dev: change palettes
  // initialState.images = initialState.images.map((image) => ({
  //   ...image,
  //   palette: 'bw',
  // }));

  // dev clear all images
  // initialState.images = [];

  render(<Provider store={getStore(initialState)}><App /></Provider>, appRoot);
};

export default initApp;
