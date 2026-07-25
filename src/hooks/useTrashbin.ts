import { saveAs } from 'file-saver';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { getQueryClient } from '@/contexts/QueryClient';
import { binaryFrameByHashQueryOptions } from '@/stores/queries/binaryFrames';
import { binaryImageByHashQueryOptions } from '@/stores/queries/binaryImages';
import {
  type TrashCount,
  ITEMS_STORE_VERSION,
  useInteractionsStore,
} from '@/stores/stores';
import { FrameData } from '@/tools/applyFrame/frameData';
import { cleanupStorage, getTrashImages, getTrashFrames } from '@/tools/getTrash';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { inflate } from '@/tools/pack';
import { reduceItems } from '@/tools/reduceArray';
import { Date } from '@/tools/safeDate';
import { toCreationDate } from '@/tools/toCreationDate';
import { type BinaryStoreItem } from '@/types/BinaryStoreItem';
import { type JSONExportBinary, type JSONExportState } from '@/types/ExportState';
import { type Frame } from '@/types/Frame';
import { type Image } from '@/types/Image';

export interface UseTrashbin {
  showTrashCount: (show: boolean) => void;
  purgeTrash: () => Promise<void>;
  downloadImages: () => Promise<void>;
  downloadFrames: () => Promise<void>;
  checkUpdateTrashCount: () => Promise<void>;
  trashCount: TrashCount;
}

interface TrashItem {
  hash: string;
  lines: string[];
  binary: string;
}

interface AnyBinaryByHashQueryOptions {
  queryKey: readonly unknown[];
  queryFn: () => Promise<BinaryStoreItem | null>;
  staleTime: number;
}

const getBinaryItems = async (
  hashes: string[],
  byHashQueryOptions: (hash: string) => AnyBinaryByHashQueryOptions,
): Promise<TrashItem[]> => {
  const queryClient = getQueryClient();

  const items = await Promise.all(hashes.map(async (hash) => {
    try {
      const binaryItem = await queryClient.fetchQuery(byHashQueryOptions(hash));

      if (!binaryItem?.data) {
        return null;
      }

      const inflated = await inflate(binaryItem.data);
      return {
        hash,
        lines: inflated.split('\n'),
        binary: binaryItem.data,
      };
    } catch {
      return null;
    }
  }));

  return items.reduce(reduceItems<TrashItem>, []);
};

const getBinaryImageItems = (hashes: string[]): Promise<TrashItem[]> => getBinaryItems(hashes, binaryImageByHashQueryOptions);
const getBinaryFrameItems = (hashes: string[]): Promise<TrashItem[]> => getBinaryItems(hashes, binaryFrameByHashQueryOptions);

const useTrashbin = (): UseTrashbin => {
  const { trashCount, showTrashCount } = useInteractionsStore();
  const { updateTrashCount, setTrashBusy } = useInteractionsStore();
  const t = useTranslations('useTrashbin');

  const downloadImages = useCallback(async (): Promise<void> => {
    const imageHashes = await getTrashImages();
    const deletedImages = await getBinaryImageItems(imageHashes);

    const jsonExportBinary: JSONExportBinary = {};
    const backupImages = deletedImages.map((image): Image | null => {
      try {
        jsonExportBinary[image.hash] = image.binary;
        return {
          type: 'mono',
          hash: image.hash,
          created: toCreationDate(),
          title: t('backupExportImage', { hash: image.hash }),
          lines: image.lines.length,
          tags: ['backup'],
          palette: 'bw',
          framePalette: 'bw',
          invertPalette: false,
          lockFrame: false,
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
  }, [t]);

  const downloadFrames = useCallback(async (): Promise<void> => {
    const frameHashes = await getTrashFrames();
    const deletedFrames = await getBinaryFrameItems(frameHashes);

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
  }, [t]);

  const checkUpdateTrashCount = useCallback(async () => {
    setTrashBusy(true);

    const [trashFrames, trashImages] = await Promise.all([
      getTrashFrames(),
      getTrashImages(),
    ]);

    updateTrashCount(trashFrames.length, trashImages.length);
    setTrashBusy(false);
  }, [setTrashBusy, updateTrashCount]);

  const purgeTrash = useCallback(async (): Promise<void> => {
    await cleanupStorage();
    showTrashCount(false);
    window.requestAnimationFrame(() => {
      checkUpdateTrashCount();
    });
  }, [checkUpdateTrashCount, showTrashCount]);

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
