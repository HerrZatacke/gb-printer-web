import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import serialportWebocket from './middlewares/serialportWebocket';
import triggerMock from './middlewares/triggerMock';
import saveState from './middlewares/saveState';
import plainText from './middlewares/plainText';
import saveLineBuffer from './middlewares/saveLineBuffer';
import startDownload from './middlewares/startDownload';
import confirmation from './middlewares/confirmation';
import saveEditImage from './middlewares/saveEditImage';
import hideLiveImage from './middlewares/hideLiveImage';
import fileDrop from './middlewares/fileDrop';
import saveRGBNImage from './middlewares/saveRGBNImage';
import deleteImage from './middlewares/deleteImage';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = [
  applyMiddleware(
    fileDrop,
    serialportWebocket,
    triggerMock,
    plainText,
    saveLineBuffer,
    startDownload,
    confirmation,
    saveEditImage,
    hideLiveImage,
    saveRGBNImage,
    deleteImage,
  ),

  // should be the last mw
  applyMiddleware(saveState),
];

const getStore = (config) => (
  createStore(reducers, config, composeEnhancers(...enhancers))
);


export default getStore;
