import { applyMiddleware } from 'redux';
import animate from './middlewares/animate';
import batch from './middlewares/batch';
import confirmation from './middlewares/confirmation';
import deleteImage from './middlewares/deleteImage';
import dropboxStorage from './middlewares/dropboxStorage';
import fileDrop from './middlewares/fileDrop';
import filters from './middlewares/filters';
import gitStorage from './middlewares/gitStorage';
import handleErrors from './middlewares/error';
import hideLiveImage from './middlewares/hideLiveImage';
import importFile from './middlewares/importFile';
import importMessage from './middlewares/importMessage';
import importQueue from './middlewares/importQueue';
import lightbox from './middlewares/lightbox';
import saveEditPalette from './middlewares/saveEditPalette';
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
  dropboxStorage,
  handleErrors,
  fileDrop,
  filters,
  gitStorage,
  hideLiveImage,
  importFile,
  importMessage,
  importQueue,
  lightbox,
  saveEditPalette,
  saveLineBuffer,
  saveRGBNImage,
  serialportWebocket,
  settings,
  share,
  startDownload,
);
