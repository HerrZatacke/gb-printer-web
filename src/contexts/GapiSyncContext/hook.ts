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
import useTrashbin from '@/hooks/useTrashbin';
import { useItemsStore, useStoragesStore } from '@/stores/stores';
import { reduceImagesMonochrome, reduceImagesRGBN } from '@/tools/isRGBNImage';
import { localforageFrames, localforageImages } from '@/tools/localforageInstance';
import { PushOptions } from '@/tools/sheetConversion/types';
import uniqueBy from '@/tools/unique/by';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { Image, MonochromeImage, RGBNImage } from '@/types/Image';
import type { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin } from '@/types/Plugin';

const AUTOSYNC_DELAY = 5000;

interface PerformPushOptions {
  sheetName: SheetName,
  newLastUpdateValue: number,
  sort: boolean;
}

interface PerformPullOptions {
  sheetName: SheetName;
  lastRemoteUpdate?: number;
  merge: boolean;
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
  const { gapiStorage, setGapiSettings } = useStoragesStore();
  const { checkUpdateTrashCount } = useTrashbin();

  const performPush = useCallback(async ({
    sheetName,
    newLastUpdateValue,
    sort,
  }: PerformPushOptions) => {
    const sheetId =  gapiStorage.sheetId;

    if (!sheetId) {
      return;
    }

    try {
      await enqueueSheetsClientRequest(async (sheetsClient) => {
        const pushOptions: PushOptions = {
          newLastUpdateValue,
          sort,
          chunkSize: 512,
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
            const frames = await localforageFrames.getSyncItems();
            await pushItems<BinaryGapiSyncItem>(
              {
                ...pushOptions,
                chunkSize: 256,
                ...createOptionsBinaryFrames(sheetsClient, sheetId),
              },
              frames,
            );
            break;
          }

          case SheetName.BIN_IMAGES: {
            const images = await localforageImages.getSyncItems();
            await pushItems<BinaryGapiSyncItem>(
              {
                ...pushOptions,
                chunkSize: 256,
                ...createOptionsBinaryImages(sheetsClient, sheetId),
              },
              images,
            );

            break;
          }

          default:
        }
      });
    } catch {
      setGapiSettings({ autoSync: false });
    }

    await updateSheets();
  }, [enqueueSheetsClientRequest, gapiStorage.sheetId, setGapiSettings, updateSheets]);


  const performPull = useCallback(async ({
    sheetName,
    lastRemoteUpdate,
    merge,
  }: PerformPullOptions): Promise<void> => {
    const sheetId =  gapiStorage.sheetId;

    if (!sheetId) {
      return;
    }

    try {
      await enqueueSheetsClientRequest(async (sheetsClient) => {
        switch (sheetName) {
          case SheetName.PALETTES: {
            const result = await pullItems<Palette>(createOptionsPalettes(sheetsClient, sheetId));

            if (merge) {
              useItemsStore.getState().addPalettes(result.items);
            } else {
              const metaData = result.sheetProperties.developerMetadata;
              const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

              useItemsStore.getState().setPalettes(result.items, timestamp);
            }
            break;
          }

          // When pulling images, both remote tables must be queried, to allow deletion
          case SheetName.IMAGES:
          case SheetName.RGBN_IMAGES: {
            const monochromeResult = await pullItems<MonochromeImage>(createOptionsImages(sheetsClient, sheetId));
            const rgbnResult = await pullItems<RGBNImage>(createOptionsImagesRGBN(sheetsClient, sheetId));

            const images: Image[] = [
              ...monochromeResult.items,
              ...rgbnResult.items,
            ];

            if (merge) {
              useItemsStore.getState().addImages(images);
            } else {
              const monochromeMetaData = monochromeResult.sheetProperties.developerMetadata;
              const monochromeTimestamp: number | undefined = monochromeMetaData ? getLastUpdate(monochromeMetaData) : lastRemoteUpdate;

              const rgbnMetaData = rgbnResult.sheetProperties.developerMetadata;
              const rgbnTimestamp: number | undefined = rgbnMetaData ? getLastUpdate(rgbnMetaData) : lastRemoteUpdate;

              const values = [monochromeTimestamp, rgbnTimestamp].filter((value) => (value !== undefined));
              const timestamp = values.length > 0 ? Math.max(...values) : undefined;

              useItemsStore.getState().setImages(images, timestamp);
            }
            break;
          }

          case SheetName.FRAME_GROUPS: {
            const result = await pullItems<FrameGroup>(createOptionsFrameGroups(sheetsClient, sheetId));

            if (merge) {
              useItemsStore.getState().updateFrameGroups(result.items);
            } else {
              const metaData = result.sheetProperties.developerMetadata;
              const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

              useItemsStore.getState().setFrameGroups(result.items, timestamp);
            }
            break;
          }

          case SheetName.FRAMES: {
            const result = await pullItems<Frame>(createOptionsFrames(sheetsClient, sheetId));

            if (merge) {
              useItemsStore.getState().addFrames(result.items);
            } else {
              const metaData = result.sheetProperties.developerMetadata;
              const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

              useItemsStore.getState().setFrames(result.items, timestamp);
            }
            break;
          }

          case SheetName.IMAGE_GROUPS: {
            const result = await pullItems<SerializableImageGroup>(createOptionsImageGroups(sheetsClient, sheetId));

            if (merge) {
              const groupUniqueById = uniqueBy<SerializableImageGroup>('id');

              const updateGroups = [
                ...useItemsStore.getState().imageGroups,
                ...result.items,
              ];

              useItemsStore.getState().setImageGroups(groupUniqueById(updateGroups));
            } else {
              const metaData = result.sheetProperties.developerMetadata;
              const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

              useItemsStore.getState().setImageGroups(result.items, timestamp);
            }
            break;
          }


          case SheetName.PLUGINS: {
            const result = await pullItems<Plugin>(createOptionsPlugins(sheetsClient, sheetId));

            if (merge) {
              const pluginsUniqueByUrl = uniqueBy<Plugin>('url');

              const updatePlugins = [
                ...useItemsStore.getState().plugins,
                ...result.items,
              ];

              useItemsStore.getState().setPlugins(pluginsUniqueByUrl(updatePlugins));
            } else {
              const metaData = result.sheetProperties.developerMetadata;
              const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

              useItemsStore.getState().setPlugins(result.items, timestamp);
            }
            break;
          }

          case SheetName.BIN_IMAGES: {
            const result = await pullItems<BinaryGapiSyncItem>(createOptionsBinaryImages(sheetsClient, sheetId));

            const metaData = result.sheetProperties.developerMetadata;
            const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

            await localforageImages.setSyncItems(result.items, merge);
            await checkUpdateTrashCount();
            useItemsStore.getState().setLastUpdate(sheetName, timestamp);
            break;
          }

          case SheetName.BIN_FRAMES: {
            const result = await pullItems<BinaryGapiSyncItem>(createOptionsBinaryFrames(sheetsClient, sheetId));

            const metaData = result.sheetProperties.developerMetadata;
            const timestamp: number | undefined = metaData ? getLastUpdate(metaData) : lastRemoteUpdate;

            await localforageFrames.setSyncItems(result.items, merge);
            await checkUpdateTrashCount();
            useItemsStore.getState().setLastUpdate(sheetName, timestamp);
            break;
          }

          default:
        }
      });
    } catch {
      setGapiSettings({ autoSync: false });
    }

    if (!merge) {
      // merge will call updateSheets later inside performPush()
      await updateSheets();
    }
  }, [checkUpdateTrashCount, enqueueSheetsClientRequest, gapiStorage.sheetId, setGapiSettings, updateSheets]);


  const performMerge = useCallback(async ({
    sheetName,
    lastRemoteUpdate,
    lastLocalUpdate,
    sort,
  }: PerformMergeOptions) => {
    const lastUpdate = Math.max(lastRemoteUpdate, lastLocalUpdate || 0);

    await performPull({
      sheetName,
      lastRemoteUpdate: lastUpdate,
      merge: true,
    });

    // Auto sync will automatically push changes after AUTOSYNC_DELAY
    if (!gapiStorage.autoSync) {
      const resultTimestamp = useItemsStore.getState().gapiLastLocalUpdates[sheetName];

      if (sheetName === SheetName.IMAGES || sheetName === SheetName.RGBN_IMAGES) {
        await performPush({
          sheetName: SheetName.IMAGES,
          newLastUpdateValue: resultTimestamp,
          sort,
        });

        await performPush({
          sheetName: SheetName.RGBN_IMAGES,
          newLastUpdateValue: resultTimestamp,
          sort,
        });
      } else {
        await performPush({
          sheetName,
          newLastUpdateValue: resultTimestamp,
          sort,
        });
      }
    }
  }, [gapiStorage.autoSync, performPull, performPush]);

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
        sort: true,
      });
    } else {
      await performPull({
        sheetName,
        lastRemoteUpdate,
        merge: false,
      });
    }
  }, [gapiStorage, isReady, performPull, performPush]);


  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.PALETTES, gapiLastLocalUpdates.palettes, gapiLastRemoteUpdates?.palettes);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.palettes, gapiLastRemoteUpdates?.palettes, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.IMAGES, gapiLastLocalUpdates.images, gapiLastRemoteUpdates?.images);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.images, gapiLastRemoteUpdates?.images, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.RGBN_IMAGES, gapiLastLocalUpdates.rgbnImages, gapiLastRemoteUpdates?.rgbnImages);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.rgbnImages, gapiLastRemoteUpdates?.rgbnImages, checkUpdate]);


  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.FRAME_GROUPS, gapiLastLocalUpdates.frameGroups, gapiLastRemoteUpdates?.frameGroups);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.frameGroups, gapiLastRemoteUpdates?.frameGroups, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.FRAMES, gapiLastLocalUpdates.frames, gapiLastRemoteUpdates?.frames);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.frames, gapiLastRemoteUpdates?.frames, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.IMAGE_GROUPS, gapiLastLocalUpdates.imageGroups, gapiLastRemoteUpdates?.imageGroups);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.imageGroups, gapiLastRemoteUpdates?.imageGroups, checkUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.PLUGINS, gapiLastLocalUpdates.plugins, gapiLastRemoteUpdates?.plugins);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.plugins, gapiLastRemoteUpdates?.plugins, checkUpdate]);


  // Binary Table Frames
  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.BIN_FRAMES, gapiLastLocalUpdates.binFrames, gapiLastRemoteUpdates?.binFrames);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.binFrames, gapiLastRemoteUpdates?.binFrames, checkUpdate]);

  // Binary Table Images
  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdate(SheetName.BIN_IMAGES, gapiLastLocalUpdates.binImages, gapiLastRemoteUpdates?.binImages);
    }, AUTOSYNC_DELAY);

    return () => window.clearTimeout(handle);
  }, [gapiLastLocalUpdates.binImages, gapiLastRemoteUpdates?.binImages, checkUpdate]);


  return {
    busy,
    performPush,
    performPull,
    performMerge,
  };
};
