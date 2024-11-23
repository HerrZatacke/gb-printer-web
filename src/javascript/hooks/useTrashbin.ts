import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { useCallback } from 'react';
import useInteractionsStore from '../app/stores/interactionsStore';
import useItemsStore from '../app/stores/itemsStore';
import { localforageReady, localforageImages, localforageFrames } from '../tools/localforageInstance';
import { dateFormat } from '../app/defaults';
import { cleanupStorage, getTrashImages, getTrashFrames } from '../tools/getTrash';
import { inflate } from '../tools/pack';
import { reduceImagesMonochrome } from '../tools/isRGBNImage';
import { reduceItems } from '../tools/reduceArray';
import type { TrashCount } from '../app/stores/interactionsStore';
import type { WrappedLocalForageInstance } from '../tools/localforageInstance/createWrappedInstance';
import type { JSONExportBinary, JSONExportState, State } from '../app/store/State';
import type { Image, MonochromeImage } from '../../types/Image';
import type { Frame } from '../../types/Frame';


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
    } catch (error) {
      return null;
    }
  }));

  return items.reduce(reduceItems<TrashItem>, []);
};

const useTrashbin = (): UseTrashbin => {
  const { trashCount, showTrashCount } = useInteractionsStore();
  const { frames } = useItemsStore();
  const images = useSelector((state: State) => (state.images as MonochromeImage[]));

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
      } catch (error) {
        return null;
      }
    }).reduce(reduceImagesMonochrome, []);


    const jsonExportState: JSONExportState = { state: { images: backupImages } };

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
      } catch (error) {
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
      },
    };

    saveAs(new Blob([...JSON.stringify({ ...jsonExportState, ...jsonExportBinary }, null, 2)]), 'backup_frames.json');
  }, [frames]);

  const stateImages = useSelector((state: State) => state.images);
  const { frames: stateFrames } = useItemsStore();
  const { updateTrashCount } = useInteractionsStore();

  const checkUpdateTrashCount = useCallback(async () => {
    const trashFramesCount = (await getTrashFrames(stateFrames)).length;
    const trashImagesCount = (await getTrashImages(stateImages as MonochromeImage[])).length;
    updateTrashCount(trashFramesCount, trashImagesCount);
  }, [stateFrames, stateImages, updateTrashCount]);

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
