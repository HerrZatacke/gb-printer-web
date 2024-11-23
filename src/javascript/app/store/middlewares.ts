import { applyMiddleware } from 'redux';
import batchUpdate from './middlewares/batchUpdate';
import fileDrop from './middlewares/fileDrop';
import importFile from './middlewares/importFile';
import importMessage from './middlewares/importMessage';
import saveEditPalette from './middlewares/saveEditPalette';
import saveRGBNImage from './middlewares/saveRGBNImage';
import share from './middlewares/share';
import startDownload from './middlewares/startDownload';
import { zustandMigrationMiddleware } from './middlewares/zustandMigration';

export default applyMiddleware(
  batchUpdate,
  fileDrop,
  importFile,
  importMessage,
  saveEditPalette,
  saveRGBNImage,
  share,
  startDownload,
  zustandMigrationMiddleware,
);
