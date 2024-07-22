import { applyMiddleware } from 'redux';
import animate from './middlewares/animate';
import batch from './middlewares/batch';
import batchUpdate from './middlewares/batchUpdate';
import deleteFrame from './middlewares/deleteFrame';
import deleteImage from './middlewares/deleteImage';
import dimensions from './middlewares/dimensions';
import dropboxStorage from './middlewares/dropboxStorage';
import fileDrop from './middlewares/fileDrop';
import gitStorage from './middlewares/gitStorage';
import importFile from './middlewares/importFile';
import importMessage from './middlewares/importMessage';
import pluginsMiddleware from './middlewares/plugins';
import saveEditPalette from './middlewares/saveEditPalette';
import settings from './middlewares/settings';
import share from './middlewares/share';
import startDownload from './middlewares/startDownload';

export default applyMiddleware(
  animate,
  batch,
  batchUpdate,
  deleteFrame,
  deleteImage,
  dimensions,
  dropboxStorage,
  fileDrop,
  gitStorage,
  importFile,
  importMessage,
  pluginsMiddleware,
  saveEditPalette,
  settings,
  share,
  startDownload,
);
