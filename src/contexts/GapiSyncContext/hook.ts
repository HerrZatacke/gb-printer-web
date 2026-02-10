import { useCallback, useEffect } from 'react';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
import { getLastUpdate } from '@/contexts/GapiSheetStateContext/tools/getLastUpdate';
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
import { useItemsStore, useStoragesStore } from '@/stores/stores';
import { reduceImagesMonochrome, reduceImagesRGBN } from '@/tools/isRGBNImage';
import { PushOptions } from '@/tools/sheetConversion/types';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { MonochromeImage, RGBNImage } from '@/types/Image';
import type { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin } from '@/types/Plugin';

export interface GapiSyncContextType {
  busy: boolean;
  performPush: (sheetName: SheetName, lastLocalUpdate: number, merge: boolean) => Promise<void>;
  performPull: (sheetName: SheetName, lastRemoteUpdate?: number) => Promise<void>;
  performMerge: (sheetName: SheetName, lastRemoteUpdate: number, lastLocalUpdate?: number) => Promise<void>;
}

export const useContextHook = (): GapiSyncContextType => {
  const { gapiLastRemoteUpdates, updateSheets, enqueueSheetsClientRequest, isReady, busy } = useGapiSheetState();
  const { gapiLastLocalUpdates } = useItemsStore();
  const { gapiStorage } = useStoragesStore();

  const performPush = useCallback(async (sheetName: SheetName, newLastUpdateValue: number, merge: boolean) => {
    const sheetId =  gapiStorage.sheetId;

    if (!sheetId) {
      return;
    }

    await enqueueSheetsClientRequest(async (sheetsClient) => {
      const pushOptions: PushOptions = {
        newLastUpdateValue,
        merge,
      };

      switch (sheetName) {
        case SheetName.PALETTES: {
          await pushItems<Palette>(
            {
              ...pushOptions,
              ...createOptionsPalettes(sheetsClient, sheetId),
            },
            useItemsStore.getState().palettes.filter(({ isPredefined }) => !isPredefined),
          );
          break;
        }

        case SheetName.IMAGES: {
          await pushItems<MonochromeImage>(
            {
              ...pushOptions,
              ...createOptionsImages(sheetsClient, sheetId),
            },
            useItemsStore.getState().images.reduce(reduceImagesMonochrome, []),
          );
          break;
        }

        case SheetName.RGBN_IMAGES: {
          await pushItems<RGBNImage>(
            {
              ...pushOptions,
              ...createOptionsImagesRGBN(sheetsClient, sheetId),
            },
            useItemsStore.getState().images.reduce(reduceImagesRGBN, []),
          );
          break;
        }

        case SheetName.FRAME_GROUPS: {
          await pushItems<FrameGroup>(
            {
              ...pushOptions,
              ...createOptionsFrameGroups(sheetsClient, sheetId),
            },
            useItemsStore.getState().frameGroups,
          );
          break;
        }

        case SheetName.FRAMES: {
          await pushItems<Frame>(
            {
              ...pushOptions,
              ...createOptionsFrames(sheetsClient, sheetId),
            },
            useItemsStore.getState().frames,
          );
          break;
        }

        case SheetName.IMAGE_GROUPS: {
          await pushItems<SerializableImageGroup>(
            {
              ...pushOptions,
              ...createOptionsImageGroups(sheetsClient, sheetId),
            },
            useItemsStore.getState().imageGroups,
          );
          break;
        }

        case SheetName.PLUGINS: {
          await pushItems<Plugin>(
            {
              ...pushOptions,
              ...createOptionsPlugins(sheetsClient, sheetId),
            },
            useItemsStore.getState().plugins,
          );
          break;
        }

        default:
      }
    });


    await updateSheets();
  }, [enqueueSheetsClientRequest, gapiStorage.sheetId, updateSheets]);


  const performPull = useCallback(async (sheetName: SheetName, lastRemoteUpdate?: number) => {
    const sheetId =  gapiStorage.sheetId;

    if (!sheetId) {
      return;
    }

    await enqueueSheetsClientRequest(async (sheetsClient) => {
      switch (sheetName) {
        case SheetName.PALETTES: {
          const result = await pullItems<Palette>(createOptionsPalettes(sheetsClient, sheetId));

          const metaData = result.sheetProperties.developerMetadata;
          const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

          useItemsStore.getState().setPalettes(result.items, timestamp);
          break;
        }

        case SheetName.IMAGES: {
          const result = await pullItems<MonochromeImage>(createOptionsImages(sheetsClient, sheetId));

          const metaData = result.sheetProperties.developerMetadata;
          const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

          useItemsStore.getState().addImages(result.items, timestamp);
          break;
        }

        case SheetName.RGBN_IMAGES: {
          const result = await pullItems<RGBNImage>(createOptionsImagesRGBN(sheetsClient, sheetId));

          const metaData = result.sheetProperties.developerMetadata;
          const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

          useItemsStore.getState().addImages(result.items, timestamp);
          break;
        }

        case SheetName.FRAME_GROUPS: {
          const result = await pullItems<FrameGroup>(createOptionsFrameGroups(sheetsClient, sheetId));

          const metaData = result.sheetProperties.developerMetadata;
          const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

          useItemsStore.getState().setFrameGroups(result.items, timestamp);
          break;
        }

        case SheetName.FRAMES: {
          const result = await pullItems<Frame>(createOptionsFrames(sheetsClient, sheetId));

          const metaData = result.sheetProperties.developerMetadata;
          const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

          useItemsStore.getState().setFrames(result.items, timestamp);
          break;
        }

        case SheetName.IMAGE_GROUPS: {
          const result = await pullItems<SerializableImageGroup>(createOptionsImageGroups(sheetsClient, sheetId));

          const metaData = result.sheetProperties.developerMetadata;
          const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

          useItemsStore.getState().setImageGroups(result.items, timestamp);
          break;
        }


        case SheetName.PLUGINS: {
          const result = await pullItems<Plugin>(createOptionsPlugins(sheetsClient, sheetId));

          const metaData = result.sheetProperties.developerMetadata;
          const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

          useItemsStore.getState().setPlugins(result.items, timestamp);
          break;
        }

        default:
      }
    });

    await updateSheets();
  }, [enqueueSheetsClientRequest, gapiStorage.sheetId, updateSheets]);


  const performMerge = useCallback(async (sheetName: SheetName, lastRemoteUpdate: number, lastLocalUpdate?: number) => {
    const lastUpdate = Math.max(lastRemoteUpdate, lastLocalUpdate || 0);
    await performPush(sheetName, lastUpdate, true);
    await performPull(sheetName, lastUpdate);
  }, [performPull, performPush]);

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
      await performPush(sheetName, lastLocalUpdate, false);
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
    performMerge,
  };
};
