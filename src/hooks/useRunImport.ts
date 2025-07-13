import dayjs from 'dayjs';
import Queue from 'promise-queue';
import { useCallback, useMemo, useState } from 'react';
import { dateFormat, missingGreyPalette } from '@/consts/defaults';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { useNavigationToolsContext } from '@/contexts/navigationTools/NavigationToolsProvider';
import { useDateFormat } from '@/hooks/useDateFormat';
import { useStores } from '@/hooks/useStores';
import useEditStore from '@/stores/editStore';
import useFiltersStore from '@/stores/filtersStore';
import useImportsStore from '@/stores/importsStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import type { TagChange } from '@/tools/applyTagChanges';
import padToHeight from '@/tools/padToHeight';
import { randomId } from '@/tools/randomId';
import saveNewImage from '@/tools/saveNewImage';
import sortBy from '@/tools/sortby';
import { type Image } from '@/types/Image';
import { type FlaggedImportItem, type ImportItem } from '@/types/ImportItem';
import { Palette } from '@/types/Palette';
import { toSlug } from './useEditImageGroup';

const sortByFilename = sortBy<ImportItem>('fileName');

interface UseRunImport {
  importQueue: FlaggedImportItem[],
  palette: Palette,
  activePalette: string,
  importPad: boolean,
  frame: string,
  createGroup: boolean,
  setFrame: (frame: string) => void,
  setActivePalette: (palette: string) => void,
  setCreateGroup: (createGroup: boolean) => void,
  runImport: () => Promise<void>,
  cancelImport: () => void,
  tagChanges: TagChange,
  resetTagChanges: () => void,
  updateTagChanges: (updates: TagChange) => void,
  importAsFrame: (id: string) => void,
  cancelItemImport: (id: string) => void,
  lastSeenCount: number,
  deletedCount: number,
  importedDuplicatesCount: number,
  queueDuplicatesCount: number,
  removeLastSeen: () => void,
  removeDeleted: () => void,
  removeImportedDuplicates: () => void,
  removeQueueDuplicates: () => void,
}

const useRunImport = (): UseRunImport => {
  const { importPad, setActivePalette, activePalette } = useSettingsStore();
  const { cancelEditImageGroup } = useEditStore();
  const { addImageGroup, palettes, images } = useItemsStore();
  const { setImageSelection } = useFiltersStore();
  const { importQueue: rawImportQueue, importQueueSet, frameQueueAdd, importQueueCancelOne } = useImportsStore();
  const { addImages, importQueueCancel } = useStores();

  const { view } = useGalleryTreeContext();
  const { navigateToGroup } = useNavigationToolsContext();


  const [frame, setFrame] = useState('');
  const [createGroup, setCreateGroup] = useState<boolean>(rawImportQueue.length > 3);

  const [tagChanges, updateTagChanges] = useState<TagChange>({
    initial: [],
    add: [],
    remove: [],
  });

  const importAsFrame = useCallback((id: string) => {
    const { importQueue } = useImportsStore.getState();
    frameQueueAdd(importQueue.filter(({ tempId }) => tempId === id));
  }, [frameQueueAdd]);

  const cancelItemImport = useCallback((id: string) => {
    importQueueCancelOne(id);
  }, [importQueueCancelOne]);

  const { formatter } = useDateFormat();

  const resetTagChanges = useCallback(() => {
    updateTagChanges(({ initial }) => ({
      initial,
      add: [],
      remove: [],
    }));
  }, []);

  const runImport = useCallback(async () => {
    const { importQueue } = useImportsStore.getState();
    const queue = new Queue(1, Infinity);
    const savedImages = await Promise.all(sortByFilename(importQueue).map((image, index) => {
      const { tiles, fileName, meta, lastModified } = image;
      const { add } = tagChanges;
      return (
        queue.add(() => (
          saveNewImage({
            lines: importPad ? padToHeight(tiles) : tiles,
            filename: fileName,
            palette: activePalette,
            frame,
            tags: add,
            // Adding index to milliseconds to ensure better sorting
            created: dayjs((lastModified || Date.now()) + index).format(dateFormat),
            meta,
          })
        ))
      );
    }));

    const imageHashes = savedImages.map(({ hash }) => hash);

    addImages(savedImages);

    if (createGroup) {
      const title = `Import ${formatter(new Date())}`;
      const slug = toSlug(title);

      cancelEditImageGroup();

      const newGroupId = randomId();

      addImageGroup(
        {
          id: newGroupId,
          slug,
          title,
          created: dayjs(Date.now()).format(dateFormat),
          coverImage: savedImages[0].hash,
          images: imageHashes,
          groups: [],
        },
        view.id,
      );

      navigateToGroup(newGroupId, 0);
    }

    setImageSelection(imageHashes);
  }, [activePalette, addImageGroup, addImages, cancelEditImageGroup, createGroup, formatter, frame, importPad, navigateToGroup, setImageSelection, tagChanges, view.id]);

  const palette = useMemo(() => palettes.find(({ shortName }) => shortName === activePalette) || missingGreyPalette, [activePalette, palettes]);

  const stateImages = useMemo(() => {
    return new Map<string, Image>(images.map((image) => [image.hash, image]));
  }, [images]);

  const importQueue = useMemo<FlaggedImportItem[]>(() => {
    const seen = new Set<string>();

    return rawImportQueue.map((importItem: ImportItem): FlaggedImportItem => {
      const alreadyImported = stateImages.get(importItem.imageHash) || null;
      const isDuplicateInQueue = seen.has(importItem.imageHash);

      seen.add(importItem.imageHash);

      return {
        ...importItem,
        isDuplicateInQueue,
        alreadyImported,
      };
    });
  }, [rawImportQueue, stateImages]);

  const lastSeenCount = useMemo<number>(() => (
    rawImportQueue.filter((importItem: ImportItem) => (
      importItem.fileName.indexOf('[last seen]') !== -1
    )).length
  ), [rawImportQueue]);

  const deletedCount = useMemo<number>(() => (
    rawImportQueue.filter((importItem: ImportItem) => (
      importItem.fileName.indexOf('[deleted]') !== -1
    )).length
  ), [rawImportQueue]);

  const queueDuplicatesCount = useMemo<number>(() => (
    importQueue.filter((importItem: FlaggedImportItem) => (
      importItem.isDuplicateInQueue
    )).length
  ), [importQueue]);

  const importedDuplicatesCount = useMemo<number>(() => (
    importQueue.filter((importItem: FlaggedImportItem) => (
      importItem.alreadyImported
    )).length
  ), [importQueue]);

  const removeLastSeen = useCallback(() => {
    importQueueSet(rawImportQueue.filter((importItem: ImportItem) => (
      importItem.fileName.indexOf('[last seen]') === -1
    )));
  }, [importQueueSet, rawImportQueue]);

  const removeDeleted = useCallback(() => {
    importQueueSet(rawImportQueue.filter((importItem: ImportItem) => (
      importItem.fileName.indexOf('[deleted]') === -1
    )));
  }, [importQueueSet, rawImportQueue]);

  const removeQueueDuplicates = useCallback(() => {
    const seen = new Set<string>();
    importQueueSet(rawImportQueue.filter((importItem: ImportItem) => {
      const isDuplicateInQueue = seen.has(importItem.imageHash);
      seen.add(importItem.imageHash);
      return !isDuplicateInQueue;
    }));
  }, [importQueueSet, rawImportQueue]);

  const removeImportedDuplicates = useCallback(() => {
    importQueueSet(rawImportQueue.filter((importItem: ImportItem) => (
      !stateImages.has(importItem.imageHash)
    )));
  }, [importQueueSet, rawImportQueue, stateImages]);

  return {
    importQueue,
    importPad,
    palette,
    activePalette,
    frame,
    tagChanges,
    createGroup,
    updateTagChanges,
    resetTagChanges,
    setFrame,
    setCreateGroup,
    runImport,
    cancelImport: importQueueCancel,
    importAsFrame,
    cancelItemImport,
    setActivePalette,
    lastSeenCount,
    importedDuplicatesCount,
    queueDuplicatesCount,
    deletedCount,
    removeLastSeen,
    removeDeleted,
    removeImportedDuplicates,
    removeQueueDuplicates,
  };
};

export default useRunImport;
