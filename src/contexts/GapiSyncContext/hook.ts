import { useCallback, useEffect, useState } from 'react';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
import {
  createOptionsFrameGroups,
  createOptionsFrames,
  createOptionsImageGroups,
  createOptionsImages,
  createOptionsImagesRGBN,
  createOptionsPalettes,
  createOptionsPlugins,
} from '@/contexts/GapiSyncContext/tools/optionCreaters';
import { pullItems } from '@/contexts/GapiSyncContext/tools/pullItems';
import { pushItems } from '@/contexts/GapiSyncContext/tools/pushItems';
import useGIS from '@/contexts/GisContext';
import { useItemsStore, useStoragesStore } from '@/stores/stores';
import { reduceImagesMonochrome, reduceImagesRGBN } from '@/tools/isRGBNImage';
import { UpdaterOptionsDynamic } from '@/tools/sheetConversion/types';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { MonochromeImage, RGBNImage } from '@/types/Image';
import { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin } from '@/types/Plugin';

export interface GapiSyncContextType {
  busy: boolean;
  performPush: (sheetName: SheetName, lastLocalUpdate: number) => Promise<void>;
  performPull: (sheetName: SheetName, lastRemoteUpdate?: number) => Promise<void>;
}

export const useContextHook = (): GapiSyncContextType => {
  const { gapiLastRemoteUpdates, updateSheets } = useGapiSheetState();
  const { gapiLastLocalUpdates } = useItemsStore();
  const { isReady } = useGIS();
  const { gapiStorage } = useStoragesStore();
  const [busy, setBusy] = useState(false);

  const performPush = useCallback(async (sheetName: SheetName, newLastUpdateValue: number) => {
    if (!gapiStorage.sheetId) {
      return;
    }

    setBusy(true);

    const updaterOptions: UpdaterOptionsDynamic = {
      sheetsClient: gapi.client.sheets,
      sheetId: gapiStorage.sheetId,
    };

    switch (sheetName) {
      case SheetName.PALETTES: {
        await pushItems<Palette>(
          {
            newLastUpdateValue,
            ...updaterOptions,
            ...createOptionsPalettes(),
          },
          useItemsStore.getState().palettes.filter(({ isPredefined }) => !isPredefined),
        );
        break;
      }

      case SheetName.IMAGES: {
        await pushItems<MonochromeImage>(
          {
            newLastUpdateValue,
            ...updaterOptions,
            ...createOptionsImages(),
          },
          useItemsStore.getState().images.reduce(reduceImagesMonochrome, []),
        );
        break;
      }

      case SheetName.RGBN_IMAGES: {
        await pushItems<RGBNImage>(
          {
            newLastUpdateValue,
            ...updaterOptions,
            ...createOptionsImagesRGBN(),
          },
          useItemsStore.getState().images.reduce(reduceImagesRGBN, []),
        );
        break;
      }

      case SheetName.FRAME_GROUPS: {
        await pushItems<FrameGroup>(
          {
            newLastUpdateValue,
            ...updaterOptions,
            ...createOptionsFrameGroups(),
          },
          useItemsStore.getState().frameGroups,
        );
        break;
      }

      case SheetName.FRAMES: {
        await pushItems<Frame>(
          {
            newLastUpdateValue,
            ...updaterOptions,
            ...createOptionsFrames(),
          },
          useItemsStore.getState().frames,
        );
        break;
      }

      case SheetName.IMAGE_GROUPS: {
        await pushItems<SerializableImageGroup>(
          {
            newLastUpdateValue,
            ...updaterOptions,
            ...createOptionsImageGroups(),
          },
          useItemsStore.getState().imageGroups,
        );
        break;
      }

      case SheetName.PLUGINS: {
        await pushItems<Plugin>(
          {
            newLastUpdateValue,
            ...updaterOptions,
            ...createOptionsPlugins(),
          },
          useItemsStore.getState().plugins,
        );
        break;
      }

      default:
    }

    updateSheets();

    setBusy(false);
  }, [gapiStorage.sheetId, updateSheets]);


  const performPull = useCallback(async (sheetName: SheetName, lastRemoteUpdate?: number) => {
    if (!gapiStorage.sheetId) {
      return;
    }

    setBusy(true);

    const updaterOptions: UpdaterOptionsDynamic = {
      sheetsClient: gapi.client.sheets,
      sheetId: gapiStorage.sheetId ,
    };

    switch (sheetName) {
      case SheetName.PALETTES: {
        const loaded = await pullItems<Palette>({
          ...updaterOptions,
          ...createOptionsPalettes(),
        });

        useItemsStore.getState().setPalettes(loaded);
        break;
      }

      case SheetName.IMAGES: {
        const loaded = await pullItems<MonochromeImage>({
          ...updaterOptions,
          ...createOptionsImages(),
        });

        useItemsStore.getState().addImages(loaded);
        break;
      }

      case SheetName.RGBN_IMAGES: {
        const loaded = await pullItems<RGBNImage>({
          ...updaterOptions,
          ...createOptionsImagesRGBN(),
        });

        useItemsStore.getState().addImages(loaded);
        break;
      }

      case SheetName.FRAME_GROUPS: {
        const loaded = await pullItems<FrameGroup>({
          ...updaterOptions,
          ...createOptionsFrameGroups(),
        });

        // ToDo
        console.log(loaded);
        break;
      }

      case SheetName.FRAMES: {
        const loaded = await pullItems<Frame>({
          ...updaterOptions,
          ...createOptionsFrames(),
        });

        useItemsStore.getState().setFrames(loaded);
        break;
      }

      case SheetName.IMAGE_GROUPS: {
        const loaded = await pullItems<SerializableImageGroup>({
          ...updaterOptions,
          ...createOptionsImageGroups(),
        });

        useItemsStore.getState().setImageGroups(loaded);
        break;
      }


      case SheetName.PLUGINS: {
        const loaded = await pullItems<Plugin>({
          ...updaterOptions,
          ...createOptionsPlugins(),
        });

        // ToDo
        console.log(loaded);
        break;
      }

      default:
    }

    if (typeof lastRemoteUpdate !== 'undefined') {
      // ToDo:
      console.log('need to set this as new local value', lastRemoteUpdate);
    }

    updateSheets();

    setBusy(false);
  }, [gapiStorage.sheetId, updateSheets]);


  const checkUpdate = useCallback(async (sheetName: SheetName, lastLocalUpdate: number, lastRemoteUpdate?: number) => {
    const { use, sheetId, token, autoSync } = gapiStorage;

    if (
      typeof lastRemoteUpdate === 'undefined' || // Still waiting for remote info
      !autoSync || // Autosync disabled
      !isReady || !use || !sheetId|| !token || // sync not ready
      lastLocalUpdate === lastRemoteUpdate // no need for update
    ) {
      return;
    }

    if (lastLocalUpdate > lastRemoteUpdate) {
      await performPush(sheetName, lastLocalUpdate);
    } else {
      await performPull(sheetName, lastRemoteUpdate);
    }
  }, [gapiStorage, isReady, performPull, performPush]);


  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.PALETTES, gapiLastLocalUpdates.palettes, gapiLastRemoteUpdates?.palettes);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.palettes, gapiLastRemoteUpdates?.palettes, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.IMAGES, gapiLastLocalUpdates.images, gapiLastRemoteUpdates?.images);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.images, gapiLastRemoteUpdates?.images, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.RGBN_IMAGES, gapiLastLocalUpdates.rgbnImages, gapiLastRemoteUpdates?.rgbnImages);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.rgbnImages, gapiLastRemoteUpdates?.rgbnImages, checkUpdate]);


  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.FRAME_GROUPS, gapiLastLocalUpdates.frameGroups, gapiLastRemoteUpdates?.frameGroups);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.frameGroups, gapiLastRemoteUpdates?.frameGroups, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.FRAMES, gapiLastLocalUpdates.frames, gapiLastRemoteUpdates?.frames);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.frames, gapiLastRemoteUpdates?.frames, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.IMAGE_GROUPS, gapiLastLocalUpdates.imageGroups, gapiLastRemoteUpdates?.imageGroups);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.imageGroups, gapiLastRemoteUpdates?.imageGroups, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.PLUGINS, gapiLastLocalUpdates.plugins, gapiLastRemoteUpdates?.plugins);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.plugins, gapiLastRemoteUpdates?.plugins, checkUpdate]);



  return {
    busy,
    performPush,
    performPull,
  };
};
