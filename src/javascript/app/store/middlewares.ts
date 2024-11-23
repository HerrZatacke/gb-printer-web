import { applyMiddleware } from 'redux';
import batchUpdate from './middlewares/batchUpdate';
import saveRGBNImage from './middlewares/saveRGBNImage';
import { zustandMigrationMiddleware } from './middlewares/zustandMigration';

export default applyMiddleware(
  batchUpdate,
  saveRGBNImage,
  zustandMigrationMiddleware,
);
