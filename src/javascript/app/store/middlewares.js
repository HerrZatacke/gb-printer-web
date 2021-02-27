import { applyMiddleware } from 'redux';
import animate from './middlewares/animate';
import batch from './middlewares/batch';
import confirmation from './middlewares/confirmation';
import deleteImage from './middlewares/deleteImage';
import fileDrop from './middlewares/fileDrop';
import filters from './middlewares/filters';
import gitStorage from './middlewares/gitStorage';
import handleErrors from './middlewares/error';
import hideLiveImage from './middlewares/hideLiveImage';
import importFile from './middlewares/importFile';
import importQueue from './middlewares/importQueue';
import lightbox from './middlewares/lightbox';
import pluginsMiddleware from './middlewares/plugins';
import printer from './middlewares/printer';
import saveEditImage from './middlewares/saveEditImage';
import saveLineBuffer from './middlewares/saveLineBuffer';
import saveRGBNImage from './middlewares/saveRGBNImage';
import serialportWebocket from './middlewares/serialportWebocket';
import settings from './middlewares/settings';
import share from './middlewares/share';
import startDownload from './middlewares/startDownload';

export default applyMiddleware(
  animate,
  batch,
  confirmation,
  deleteImage,
  handleErrors,
  fileDrop,
  filters,
  gitStorage,
  hideLiveImage,
  importFile,
  importQueue,
  lightbox,
  pluginsMiddleware,
  printer,
  saveEditImage,
  saveLineBuffer,
  saveRGBNImage,
  serialportWebocket,
  settings,
  share,
  startDownload,
);
