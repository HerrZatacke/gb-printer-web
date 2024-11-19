import { useStore } from 'react-redux';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import useInteractionsStore from '../app/stores/interactionsStore';
import useItemsStore from '../app/stores/itemsStore';
import { localforageReady, localforageImages, localforageFrames } from '../tools/localforageInstance';
import { dateFormat } from '../app/defaults';
import { cleanupStorage, getTrashImages, getTrashFrames } from '../tools/getTrash';
import { inflate } from '../tools/pack';
import { reduceImagesMonochrome } from '../tools/isRGBNImage';
import { reduceItems } from '../tools/reduceArray';
import { checkUpdateTrashCount } from '../tools/checkUpdateTrashCount';
import type { TrashCount } from '../app/stores/interactionsStore';
import type { WrappedLocalForageInstance } from '../tools/localforageInstance/createWrappedInstance';
import type { JSONExportBinary, JSONExportState, TypedStore } from '../app/store/State';
import type { Image, MonochromeImage } from '../../types/Image';
import type { Frame } from '../../types/Frame';

export interface UseTrashbin {
  showTrashCount: (show: boolean) => void
  purgeTrash: () => Promise<void>
  downloadImages: () => Promise<void>
  downloadFrames: () => Promise<void>
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

  const store: TypedStore = useStore();

  const downloadImages = async (): Promise<void> => {
    const imageHashes = await getTrashImages(store.getState().images as MonochromeImage[]);
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

  const downloadFrames = async (): Promise<void> => {
    const { frames } = useItemsStore.getState();
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
  };

  const purgeTrash = async (): Promise<void> => {
    const { images } = store.getState();
    const { frames } = useItemsStore.getState();
    await cleanupStorage({ images, frames });

    const { images: cleanedImages } = store.getState();
    const { frames: cleanedFrames } = useItemsStore.getState();
    checkUpdateTrashCount(cleanedImages, cleanedFrames);
  };

  return {
    showTrashCount,
    purgeTrash,
    downloadImages,
    downloadFrames,
    trashCount,
  };
};

export default useTrashbin;
