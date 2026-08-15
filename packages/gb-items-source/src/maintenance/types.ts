import { type Repositories } from '@/types';

export type MaintenanceTask = (repositories: Repositories) => Promise<void>;
