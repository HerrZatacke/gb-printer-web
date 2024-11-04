import type { Actions } from '../../javascript/app/store/actions';

export interface StorageSyncStartAction {
  type: Actions.STORAGE_SYNC_START,
  payload: {
    storageType: string,
    direction: string,
  }
}
