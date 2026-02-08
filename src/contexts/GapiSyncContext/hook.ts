import { useCallback, useEffect, useState } from 'react';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
import {
  updateFrameGroups,
  updateFrames,
  updateImageGroups,
  updateImages,
  updateImagesRGBN,
  updatePalettes,
  updatePlugins,
} from '@/contexts/GapiSyncContext/tools/updaters';
import useGIS from '@/contexts/GisContext';
import { useItemsStore, useStoragesStore } from '@/stores/stores';

export interface GapiSyncContextType {
  busy: boolean;
  performUpdate: (sheetName: SheetName, lastLocalUpdate: number) => Promise<void>;
}

export const useContextHook = (): GapiSyncContextType => {
  const { gapiLastRemoteUpdates, updateSheets } = useGapiSheetState();
  const { gapiLastLocalUpdates } = useItemsStore();
  const { isReady } = useGIS();
  const { gapiStorage } = useStoragesStore();
  const [busy, setBusy] = useState(false);

  const performUpdate = useCallback(async (sheetName: SheetName, newLastUpdate: number) => {
    if (!gapiStorage.sheetId) {
      return;
    }

    setBusy(true);

    const updaterOptions = {
      sheetsClient: gapi.client.sheets,
      sheetId: gapiStorage.sheetId ,
      newLastUpdateValue: newLastUpdate,
    };

    switch (sheetName) {
      case SheetName.PALETTES:
        await updatePalettes(updaterOptions, useItemsStore.getState().palettes);
        break;
      case SheetName.IMAGES:
        await updateImages(updaterOptions, useItemsStore.getState().images);
        break;
      case SheetName.RGBN_IMAGES:
        await updateImagesRGBN(updaterOptions, useItemsStore.getState().images);
        break;
      case SheetName.FRAME_GROUPS:
        await updateFrameGroups(updaterOptions, useItemsStore.getState().frameGroups);
        break;
      case SheetName.FRAMES:
        await updateFrames(updaterOptions, useItemsStore.getState().frames);
        break;
      case SheetName.IMAGE_GROUPS:
        await updateImageGroups(updaterOptions, useItemsStore.getState().imageGroups);
        break;
      case SheetName.PLUGINS:
        await updatePlugins(updaterOptions, useItemsStore.getState().plugins);
        break;
      default:
    }

    updateSheets();

    setBusy(false);
  }, [gapiStorage.sheetId, updateSheets]);

  const checkUpdate = useCallback(async (sheetName: SheetName, lastLocalUpdate: number, lastRemoteUpdate?: number) => {
    const { use, sheetId, token } = gapiStorage;

    if (
      typeof lastRemoteUpdate === 'undefined' || // Still waiting for remote info
      !isReady || !use || !sheetId|| !token || // sync not ready
      lastLocalUpdate === lastRemoteUpdate // no need for update
    ) {
      return;
    }

    if (lastLocalUpdate > lastRemoteUpdate) {
      await performUpdate(sheetName, lastLocalUpdate);

      console.log({
        sheetName,
        lastLocalUpdate,
        lastRemoteUpdate,
      });
    }
  }, [gapiStorage, isReady, performUpdate]);



  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.IMAGES, gapiLastLocalUpdates.images, gapiLastRemoteUpdates?.images);
    }, 1);

    return window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.images, gapiLastRemoteUpdates?.images, checkUpdate]);


  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.PALETTES, gapiLastLocalUpdates.palettes, gapiLastRemoteUpdates?.palettes);
    }, 1);

    return window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.palettes, gapiLastRemoteUpdates?.palettes, checkUpdate]);

  return {
    busy,
    performUpdate,
  };
};
