import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import serialportWebocket from './middlewares/serialportWebocket';
import triggerMock from './middlewares/triggerMock';
import saveState from './middlewares/saveState';
import plainText from './middlewares/plainText';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = [
  applyMiddleware(serialportWebocket),
  applyMiddleware(triggerMock),
  applyMiddleware(plainText),

  // should be the last mw
  applyMiddleware(saveState),
];

const getStore = (config) => (
  createStore(reducers, config, composeEnhancers(...enhancers))
);


export default getStore;
