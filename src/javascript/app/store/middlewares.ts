import { applyMiddleware } from 'redux';
import batch from './middlewares/batch';
import batchUpdate from './middlewares/batchUpdate';
import fileDrop from './middlewares/fileDrop';
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
  batch,
  batchUpdate,
  fileDrop,
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
