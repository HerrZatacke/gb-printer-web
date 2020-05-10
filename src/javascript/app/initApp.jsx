import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './components/App';
import getStore from './store';

const initApp = () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  const initialState = {
    socketUrl: 'localhost:3001',
  };

  render(<Provider store={getStore(initialState)}><App /></Provider>, appRoot);
};

export default initApp;
