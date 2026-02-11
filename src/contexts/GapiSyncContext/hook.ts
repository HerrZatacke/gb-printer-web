import { useCallback, useEffect } from 'react';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
import { getLastUpdate } from '@/contexts/GapiSheetStateContext/tools/getLastUpdate';
import {
  createOptionsBinaryFrames,
  createOptionsBinaryImages,
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
import { BinaryGapiSyncItem } from '@/contexts/GapiSyncContext/tools/types';
import { useItemsStore, useStoragesStore } from '@/stores/stores';
import { getAllFrames } from '@/tools/applyFrame/frameData';
import { reduceImagesMonochrome, reduceImagesRGBN } from '@/tools/isRGBNImage';
import { PushOptions } from '@/tools/sheetConversion/types';
import { getAllImages } from '@/tools/storage';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { MonochromeImage, RGBNImage } from '@/types/Image';
import type { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin } from '@/types/Plugin';

interface PerformPushOptions {
  sheetName: SheetName,
  newLastUpdateValue: number,
  merge: boolean;
  sort: boolean;
}

interface PerformPullOptions {
  sheetName: SheetName;
  lastRemoteUpdate?: number;
}

interface PerformMergeOptions {
  sheetName: SheetName;
  lastRemoteUpdate: number;
  lastLocalUpdate?: number;
  sort: boolean;
}

export interface GapiSyncContextType {
  busy: boolean;
  performPush: (options: PerformPushOptions) => Promise<void>;
  performPull: (options: PerformPullOptions) => Promise<void>;
  performMerge: (options: PerformMergeOptions) => Promise<void>;
}

export const useContextHook = (): GapiSyncContextType => {
  const { gapiLastRemoteUpdates, updateSheets, enqueueSheetsClientRequest, isReady, busy } = useGapiSheetState();
  const { gapiLastLocalUpdates } = useItemsStore();
  const { gapiStorage } = useStoragesStore();

  const performPush = useCallback(async ({
    sheetName,
    newLastUpdateValue,
    merge,
    sort,
  }: PerformPushOptions) => {
    const sheetId =  gapiStorage.sheetId;

    if (!sheetId) {
      return;
    }

    await enqueueSheetsClientRequest(async (sheetsClient) => {
      const pushOptions: PushOptions = {
        newLastUpdateValue,
        merge,
        sort,
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

        case SheetName.BIN_FRAMES: {
          const frames = await getAllFrames();
          await pushItems<BinaryGapiSyncItem>(
            {
              ...pushOptions,
              ...createOptionsBinaryFrames(sheetsClient, sheetId),
            },
            frames.map(([hash, data]) => ({ hash, data })),
          );
          break;
        }

        case SheetName.BIN_IMAGES: {
          const startTime = Date.now();

          console.log(`📊 Collecting ${sheetName}`);
          const images = await getAllImages();
          console.log(`📊 Collected ${sheetName} in ${Date.now() - startTime}ms`);

          // ToDo: move this size-check into "pushItems" method
          if(images.find(([, data]) => (data.length >= 50000))) {
            throw new Error('Some cells are too big');
          }

          console.log('largest image', images.reduce((acc, [,data]) => Math.max(acc, data.length), -Infinity));
          console.log('smallest image', images.reduce((acc, [,data]) => Math.min(acc, data.length), Infinity));

          const smallest = images.filter(([,data]) => (data.length < 100));

          console.log(smallest);
          console.log(smallest.length);

          await pushItems<BinaryGapiSyncItem>(
            {
              ...pushOptions,
              ...createOptionsBinaryImages(sheetsClient, sheetId),
            },
            // ToDo: Upload images in sensible batches
            images.slice(0, 500).map(([hash, data]) => ({ hash, data })),
            // images.map(([hash, data]) => ({ hash, data })),
          );

          break;
        }

        default:
      }
    });


    await updateSheets();
  }, [enqueueSheetsClientRequest, gapiStorage.sheetId, updateSheets]);


  const performPull = useCallback(async ({
    sheetName,
    lastRemoteUpdate,
  }: PerformPullOptions) => {
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


  const performMerge = useCallback(async ({
    sheetName,
    lastRemoteUpdate,
    lastLocalUpdate,
    sort,
  }: PerformMergeOptions) => {
    const lastUpdate = Math.max(lastRemoteUpdate, lastLocalUpdate || 0);

    await performPush({
      sheetName,
      newLastUpdateValue: lastUpdate,
      merge: true,
      sort,
    });

    await performPull({
      sheetName,
      lastRemoteUpdate: lastUpdate,
    });
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
      await performPush({
        sheetName,
        newLastUpdateValue: lastLocalUpdate,
        merge: false,
        sort: true,
      });
    } else {
      await performPull({
        sheetName,
        lastRemoteUpdate,
      });
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


  // Binary Table Frames
  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.BIN_FRAMES, gapiLastLocalUpdates.binFrames, gapiLastRemoteUpdates?.binFrames);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.binFrames, gapiLastRemoteUpdates?.binFrames, checkUpdate]);

  // Binary Table Images
  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.BIN_IMAGES, gapiLastLocalUpdates.binImages, gapiLastRemoteUpdates?.binImages);
    }, 5000);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.binImages, gapiLastRemoteUpdates?.binImages, checkUpdate]);


  return {
    busy,
    performPush,
    performPull,
    performMerge,
  };
};
