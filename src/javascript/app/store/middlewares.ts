import { applyMiddleware } from 'redux';
import { zustandMigrationMiddleware } from './middlewares/zustandMigration';

export default applyMiddleware(
  zustandMigrationMiddleware,
);
