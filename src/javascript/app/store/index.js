import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import cleanState from '../../tools/cleanState';
import confirmation from './middlewares/confirmation';
import deleteImage from './middlewares/deleteImage';
import fileDrop from './middlewares/fileDrop';
import hideLiveImage from './middlewares/hideLiveImage';
import lightbox from './middlewares/lightbox';
import plainText from './middlewares/plainText';
import saveEditImage from './middlewares/saveEditImage';
import saveLineBuffer from './middlewares/saveLineBuffer';
import saveRGBNImage from './middlewares/saveRGBNImage';
import saveState from './middlewares/saveState';
import serialportWebocket from './middlewares/serialportWebocket';
import startDownload from './middlewares/startDownload';
import triggerMock from './middlewares/triggerMock';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = [
  applyMiddleware(
    confirmation,
    deleteImage,
    fileDrop,
    hideLiveImage,
    lightbox,
    plainText,
    saveEditImage,
    saveLineBuffer,
    saveRGBNImage,
    serialportWebocket,
    startDownload,
    triggerMock,
  ),

  // should be the last mw
  applyMiddleware(saveState),
];

const getStore = (config) => (
  createStore(reducers, cleanState(config), composeEnhancers(...enhancers))
);


export default getStore;
