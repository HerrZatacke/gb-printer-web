import { saveAs } from 'file-saver';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import useInteractionsStore from '@/stores/interactionsStore';
import type { TrashCount } from '@/stores/interactionsStore';
import useItemsStore, { ITEMS_STORE_VERSION } from '@/stores/itemsStore';
import { cleanupStorage, getTrashImages, getTrashFrames } from '@/tools/getTrash';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { localforageReady, localforageImages, localforageFrames } from '@/tools/localforageInstance';
import type { WrappedLocalForageInstance } from '@/tools/localforageInstance/createWrappedInstance';
import { inflate } from '@/tools/pack';
import { reduceItems } from '@/tools/reduceArray';
import { toCreationDate } from '@/tools/toCreationDate';
import type { JSONExportBinary, JSONExportState } from '@/types/ExportState';
import type { Frame } from '@/types/Frame';
import type { Image } from '@/types/Image';
import { FrameData } from '@/tools/applyFrame/frameData';

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
  const t = useTranslations('useTrashbin');

  const downloadImages = useCallback(async (): Promise<void> => {
    const imageHashes = await getTrashImages(images);
    const deletedImages = await getItems(imageHashes, localforageImages);

    const jsonExportBinary: JSONExportBinary = {};
    const backupImages = deletedImages.map((image): Image | null => {
      try {
        jsonExportBinary[image.hash] = image.binary;
        return {
          hash: image.hash,
          created: toCreationDate(),
          title: t('backupExportImage', { hash: image.hash }),
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
  }, [images, t]);

  const downloadFrames = useCallback(async (): Promise<void> => {
    const frameHashes = await getTrashFrames(frames);
    const deletedFrames = await getItems(frameHashes, localforageFrames);

    const jsonExportBinary: JSONExportBinary = {};
    const backupFrames: Frame[] = deletedFrames.map((frame, index) => {
      try {
        jsonExportBinary[`frame-${frame.hash}`] = frame.binary;

        const frameData = JSON.parse(frame.lines[0]) as FrameData;
        const lines = frameData.upper.length + (frameData.left.length * 20) + frameData.lower.length;

        return {
          hash: frame.hash,
          lines,
          name: t('backupExportFrame', { hash: frame.hash }),
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
            name: t('reImportedTrashFrames'),
          },
        ],
        lastUpdateUTC: Math.floor((new Date()).getTime() / 1000),
        version: ITEMS_STORE_VERSION,
      },
    };

    saveAs(new Blob([...JSON.stringify({ ...jsonExportState, ...jsonExportBinary }, null, 2)]), 'backup_frames.json');
  }, [t, frames]);

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
