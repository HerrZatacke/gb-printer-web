import { type ItemsInvalidation } from 'gb-printer-schemas';
import { type Repositories } from '@/types';

export type MaintenanceTask = (repositories: Repositories) => Promise<ItemsInvalidation[]>;
