import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import saveState from './middlewares/saveState';
import middlewares from './middlewares';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = [
  middlewares,

  // should be the last mw
  applyMiddleware(saveState),
];

const getStore = (config) => {
  const store = createStore(reducers, config, composeEnhancers(...enhancers));
  window.store = store;
  return store;
};


export default getStore;
