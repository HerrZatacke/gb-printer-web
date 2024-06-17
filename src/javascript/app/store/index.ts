import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import saveState from './middlewares/saveState';
import middlewares from './middlewares';
import type { State } from './State';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = [
  middlewares,
  applyMiddleware(saveState), // should be the last mw
];

const getStore = (initialState: Partial<State>) => {
  const store = createStore(
    reducers,
    initialState,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    composeEnhancers(...enhancers),
  );
  window.store = store;
  return store;
};


export default getStore;
