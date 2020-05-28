import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import cleanState from '../../tools/cleanState';
import saveState from './middlewares/saveState';
import middlewares from './middlewares';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = [
  middlewares,

  // should be the last mw
  applyMiddleware(saveState),
];

const getStore = (config) => (
  createStore(reducers, cleanState(config), composeEnhancers(...enhancers))
);


export default getStore;
