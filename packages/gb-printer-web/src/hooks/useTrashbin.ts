import { saveAs } from 'file-saver';
import {
  Date,
  toCreationDate,
  type Image,
  type Frame,
} from 'gb-printer-schemas';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { getQueryClient } from '@/contexts/QueryClient';
import { binaryFrameByHashQueryOptions } from '@/stores/items/queries/binaryFrames';
import { binaryImageByHashQueryOptions } from '@/stores/items/queries/binaryImages';
import {
  type TrashCount,
  ITEMS_DB_VERSION,
  useInteractionsStore,
} from '@/stores/stores';
import { FrameData } from '@/tools/applyFrame/frameData';
import { cleanupStorage, getTrashImages, getTrashFrames } from '@/tools/getTrash';
import { inflate } from '@/tools/pack';
import { reduceItems } from '@/tools/reduceArray';
import { type BinaryStoreItem } from '@/types/BinaryStoreItem';
import { createJSONExport, type ExportableState } from '@/types/ExportState';

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

    const binaries: Record<string, string> = {};

    const backupImages: Image[] = deletedImages.map((image): Image | null => {
      try {
        binaries[image.hash] = image.binary;
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
    }).filter((i): i is Image => Boolean(i));

    const exportState: ExportableState = {
      images: backupImages,
      lastUpdateUTC: Math.floor((new Date()).getTime() / 1000),
      version: ITEMS_DB_VERSION,
    };

    const jsonExport = createJSONExport(exportState, binaries);

    saveAs(new Blob([...JSON.stringify(jsonExport, null, 2)]), 'backup_images.json');
  }, [t]);

  const downloadFrames = useCallback(async (): Promise<void> => {
    const frameHashes = await getTrashFrames();
    const deletedFrames = await getBinaryFrameItems(frameHashes);

    const binaries: Record<string, string> = {};

    const backupFrames: Frame[] = deletedFrames.map((frame, index) => {
      try {
        binaries[`frame-${frame.hash}`] = frame.binary;

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


    const exportState: ExportableState = {
      frames: backupFrames,
      frameGroups: [
        {
          id: 'bak',
          name: t('reImportedTrashFrames'),
        },
      ],
      lastUpdateUTC: Math.floor((new Date()).getTime() / 1000),
      version: ITEMS_DB_VERSION,
    };

    const jsonExport = createJSONExport(exportState, binaries);

    saveAs(new Blob([...JSON.stringify(jsonExport, null, 2)]), 'backup_frames.json');
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
