import { applyMiddleware } from 'redux';
import batch from './middlewares/batch';
import confirmation from './middlewares/confirmation';
import deleteImage from './middlewares/deleteImage';
import fileDrop from './middlewares/fileDrop';
import filters from './middlewares/filters';
import handleErrors from './middlewares/error';
import hideLiveImage from './middlewares/hideLiveImage';
import lightbox from './middlewares/lightbox';
import plainText from './middlewares/plainText';
import printer from './middlewares/printer';
import saveEditImage from './middlewares/saveEditImage';
import saveLineBuffer from './middlewares/saveLineBuffer';
import saveRGBNImage from './middlewares/saveRGBNImage';
import serialportWebocket from './middlewares/serialportWebocket';
import settings from './middlewares/settings';
import share from './middlewares/share';
import startDownload from './middlewares/startDownload';

export default applyMiddleware(
  batch,
  confirmation,
  deleteImage,
  handleErrors,
  fileDrop,
  filters,
  hideLiveImage,
  lightbox,
  plainText,
  printer,
  saveEditImage,
  saveLineBuffer,
  saveRGBNImage,
  serialportWebocket,
  settings,
  share,
  startDownload,
);
