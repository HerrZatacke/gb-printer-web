export const SyncDirection = {
  UP: 'up',
  DOWN: 'down',
} as const;
export type SyncDirection = (typeof SyncDirection)[keyof typeof SyncDirection];

export const StorageType = {
  GIT: 'git',
  DROPBOX: 'dropbox',
  DROPBOXIMAGES: 'dropboximages',
} as const;
export type StorageType = (typeof StorageType)[keyof typeof StorageType];
