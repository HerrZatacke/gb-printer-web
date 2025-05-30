import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useCallback } from 'react';
import { dateFormat } from '@/consts/defaults';
import useInteractionsStore from '@/stores/interactionsStore';
import type { TrashCount } from '@/stores/interactionsStore';
import useItemsStore, { ITEMS_STORE_VERSION } from '@/stores/itemsStore';
import { cleanupStorage, getTrashImages, getTrashFrames } from '@/tools/getTrash';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { localforageReady, localforageImages, localforageFrames } from '@/tools/localforageInstance';
import type { WrappedLocalForageInstance } from '@/tools/localforageInstance/createWrappedInstance';
import { inflate } from '@/tools/pack';
import { reduceItems } from '@/tools/reduceArray';
import type { JSONExportBinary, JSONExportState } from '@/types/ExportState';
import type { Frame } from '@/types/Frame';
import type { Image } from '@/types/Image';


export interface UseTrashbin {
  showTrashCount: (show: boolean) => void
  purgeTrash: () => Promise<void>
  downloadImages: () => Promise<void>
  downloadFrames: () => Promise<void>
  checkUpdateTrashCount: () => Promise<void>
  trashCount: TrashCount,
}

interface TrashItem {
  hash: string,
  lines: string[],
  binary: string,
}

const getItems = async (keys: string[], storage: WrappedLocalForageInstance<string>): Promise<TrashItem[]> => {
  await localforageReady();
  const items = await Promise.all(keys.map(async (hash) => {
    try {
      const binary = await storage.getItem(hash);

      if (!binary) {
        return null;
      }

      const inflated = await inflate(binary);
      return {
        hash,
        lines: inflated.split('\n'),
        binary,
      };
    } catch {
      return null;
    }
  }));

  return items.reduce(reduceItems<TrashItem>, []);
};

const useTrashbin = (): UseTrashbin => {
  const { trashCount, showTrashCount } = useInteractionsStore();
  const { frames, images } = useItemsStore();
  const { updateTrashCount } = useInteractionsStore();

  const downloadImages = async (): Promise<void> => {
    const imageHashes = await getTrashImages(images);
    const deletedImages = await getItems(imageHashes, localforageImages);

    const jsonExportBinary: JSONExportBinary = {};
    const backupImages = deletedImages.map((image): Image | null => {
      try {
        jsonExportBinary[image.hash] = image.binary;
        return {
          hash: image.hash,
          created: dayjs().format(dateFormat),
          title: `Backup export ${image.hash}`,
          lines: image.lines.length,
          tags: ['backup'],
          palette: 'bw',
          framePalette: 'bw',
          invertPalette: false,
          invertFramePalette: false,
          frame: '',
        };
      } catch {
        return null;
      }
    }).reduce(reduceImagesMonochrome, []);


    const jsonExportState: JSONExportState = { state: {
      images: backupImages,
      lastUpdateUTC: Math.floor((new Date()).getTime() / 1000),
      version: ITEMS_STORE_VERSION,
    } };

    saveAs(new Blob([...JSON.stringify({ ...jsonExportState, ...jsonExportBinary }, null, 2)]), 'backup_images.json');
  };

  const downloadFrames = useCallback(async (): Promise<void> => {
    const frameHashes = await getTrashFrames(frames);
    const deletedFrames = await getItems(frameHashes, localforageFrames);

    const jsonExportBinary: JSONExportBinary = {};
    const backupFrames = deletedFrames.map((frame, index) => {
      try {
        jsonExportBinary[`frame-${frame.hash}`] = frame.binary;
        return {
          hash: frame.hash,
          name: `Backup export ${frame.hash}`,
          id: `bak${index.toString(10).padStart(2, '0')}`,
        };
      } catch {
        return null;
      }
    }).reduce(reduceItems<Frame>, []);

    const jsonExportState: JSONExportState = {
      state: {
        frames: backupFrames,
        frameGroups: [
          {
            id: 'bak',
            name: 'Re-imported trash frames',
          },
        ],
        lastUpdateUTC: Math.floor((new Date()).getTime() / 1000),
        version: ITEMS_STORE_VERSION,
      },
    };

    saveAs(new Blob([...JSON.stringify({ ...jsonExportState, ...jsonExportBinary }, null, 2)]), 'backup_frames.json');
  }, [frames]);

  const checkUpdateTrashCount = useCallback(async () => {
    const trashFramesCount = (await getTrashFrames(frames)).length;
    const trashImagesCount = (await getTrashImages(images)).length;
    updateTrashCount(trashFramesCount, trashImagesCount);
  }, [frames, images, updateTrashCount]);

  const purgeTrash = useCallback(async (): Promise<void> => {
    await cleanupStorage({ images, frames });
    showTrashCount(false);
    window.requestAnimationFrame(() => {
      checkUpdateTrashCount();
    });
  }, [checkUpdateTrashCount, frames, images, showTrashCount]);

  return {
    showTrashCount,
    purgeTrash,
    downloadImages,
    downloadFrames,
    checkUpdateTrashCount,
    trashCount,
  };
};

export default useTrashbin;
