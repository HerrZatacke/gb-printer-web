import { applyMiddleware } from 'redux';
import batchUpdate from './middlewares/batchUpdate';
import fileDrop from './middlewares/fileDrop';
import saveEditPalette from './middlewares/saveEditPalette';
import saveRGBNImage from './middlewares/saveRGBNImage';
import { zustandMigrationMiddleware } from './middlewares/zustandMigration';

export default applyMiddleware(
  batchUpdate,
  fileDrop,
  saveEditPalette,
  saveRGBNImage,
  zustandMigrationMiddleware,
);
