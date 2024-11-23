import { applyMiddleware } from 'redux';
import batchUpdate from './middlewares/batchUpdate';
import { zustandMigrationMiddleware } from './middlewares/zustandMigration';

export default applyMiddleware(
  batchUpdate,
  zustandMigrationMiddleware,
);
