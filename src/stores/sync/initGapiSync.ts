import type { StoreApi } from 'zustand';
import { ItemsState } from '@/stores/itemsStore';
import { StoragesState } from '@/stores/storagesStore';
import { GapiSettings } from '@/types/Sync';

type FnTeardown = () => void;

export const initGapiSync = (
  storagesStore: StoreApi<StoragesState>,
  itemsStore: StoreApi<ItemsState>,
): FnTeardown => {

  let gapiConfig: GapiSettings = storagesStore.getState().gapiStorage;

  const unsubscribeConfig = storagesStore.subscribe((state) => {
    if (state.gapiStorage !== gapiConfig) {
      console.log('gapiConfig has changed!');
      gapiConfig = state.gapiStorage;
    }
  });


  let itemsState: ItemsState = itemsStore.getState();

  const unsubscribeItems = itemsStore.subscribe(
    (state) => {
      if (state !== itemsState) {
        console.log('itemsState has changed!');
        itemsState = state;
      }
    },
  );

  return () => {
    unsubscribeConfig();
    unsubscribeItems();
  };
};
