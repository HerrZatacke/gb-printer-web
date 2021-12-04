import { applyMiddleware } from 'redux';
import animate from './middlewares/animate';
import batch from './middlewares/batch';
import deleteFrame from './middlewares/deleteFrame';
import deleteImage from './middlewares/deleteImage';
import dropboxStorage from './middlewares/dropboxStorage';
import fileDrop from './middlewares/fileDrop';
import gitStorage from './middlewares/gitStorage';
import handleErrors from './middlewares/error';
import importFile from './middlewares/importFile';
import importMessage from './middlewares/importMessage';
import importQueue from './middlewares/importQueue';
import lightbox from './middlewares/lightbox';
import pluginsMiddleware from './middlewares/plugins';
import saveEditPalette from './middlewares/saveEditPalette';
import saveRGBNImage from './middlewares/saveRGBNImage';
import settings from './middlewares/settings';
import share from './middlewares/share';
import startDownload from './middlewares/startDownload';

export default applyMiddleware(
  animate,
  batch,
  deleteFrame,
  deleteImage,
  dropboxStorage,
  handleErrors,
  fileDrop,
  gitStorage,
  importFile,
  importMessage,
  importQueue,
  lightbox,
  pluginsMiddleware,
  saveEditPalette,
  saveRGBNImage,
  settings,
  share,
  startDownload,
);
