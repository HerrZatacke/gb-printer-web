import { applyMiddleware } from 'redux';
import animate from './middlewares/animate';
import batch from './middlewares/batch';
import batchUpdate from './middlewares/batchUpdate';
import deleteFrame from './middlewares/deleteFrame';
import deleteImage from './middlewares/deleteImage';
import dropboxStorage from './middlewares/dropboxStorage';
import fileDrop from './middlewares/fileDrop';
import gitStorage from './middlewares/gitStorage';
import importFile from './middlewares/importFile';
import importMessage from './middlewares/importMessage';
import pluginsMiddleware from './middlewares/plugins';
import saveEditPalette from './middlewares/saveEditPalette';
import saveRGBNImage from './middlewares/saveRGBNImage';
import settings from './middlewares/settings';
import share from './middlewares/share';
import startDownload from './middlewares/startDownload';
import { zustandMigrationMiddleware } from './middlewares/zustandMigration';

export default applyMiddleware(
  animate,
  batch,
  batchUpdate,
  deleteFrame,
  deleteImage,
  dropboxStorage,
  fileDrop,
  gitStorage,
  importFile,
  importMessage,
  pluginsMiddleware,
  saveEditPalette,
  saveRGBNImage,
  settings,
  share,
  startDownload,
  zustandMigrationMiddleware,
);
