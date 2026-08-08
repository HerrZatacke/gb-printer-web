import { useQueryClient } from '@tanstack/react-query';
import { Palette } from 'gb-printer-schemas';
import {
  Date,
  toCreationDate,
  type Image,
} from 'gb-printer-schemas';
import { useTranslations } from 'next-intl';
import Queue from 'promise-queue';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useActivePalette } from '@/hooks/useActivePalette';
import { useDateFormat } from '@/hooks/useDateFormat';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useStores } from '@/hooks/useStores';
import { imagesByHashesQueryOptions } from '@/stores/items/queries/images';
import {
  useEditStore,
  useFiltersStore,
  useImportsStore,
  useSettingsStore,
} from '@/stores/stores';
import { type TagChange } from '@/tools/applyTagChanges';
import padToHeight from '@/tools/padToHeight';
import { randomId } from '@/tools/randomId';
import saveNewImage from '@/tools/saveNewImage';
import sortBy from '@/tools/sortby';
import { type SerializableImageGroup } from '@/types/ImageGroup';
import { type FlaggedImportItem, type ImportItem } from '@/types/ImportItem';
import { toSlug } from './useEditImageGroup';

const sortByFilename = sortBy<ImportItem>('fileName');

interface UseRunImport {
  importQueue: FlaggedImportItem[];
  palette: Palette;
  activePalette: string;
  importPad: boolean;
  frame: string;
  createGroup: boolean;
  setFrame: (frame: string) => void;
  setActivePalette: (palette: string) => void;
  setCreateGroup: (createGroup: boolean) => void;
  runImport: () => Promise<void>;
  cancelImport: () => void;
  tagChanges: TagChange;
  resetTagChanges: () => void;
  updateTagChanges: (updates: TagChange) => void;
  importAsFrame: (id: string) => void;
  cancelItemImport: (id: string) => void;
  lastSeenCount: number;
  deletedCount: number;
  importedDuplicatesCount: number;
  queueDuplicatesCount: number;
  removeLastSeen: () => void;
  removeDeleted: () => void;
  removeImportedDuplicates: () => void;
  removeQueueDuplicates: () => void;
}

const useRunImport = (): UseRunImport => {
  const {
    importPad,
    setActivePalette,
    activePalette,
    createGroup: stateCreateGroup,
    setCreateGroup: stateSetCreateGroup,
  } = useSettingsStore();
  const { cancelEditImageGroup } = useEditStore();
  const { updateImageGroup } = useImageGroups({});
  const { setImageSelection } = useFiltersStore();
  const { importQueue: rawImportQueue, importQueueSet, frameQueueAdd, importQueueCancelOne } = useImportsStore();
  const { addImages, importQueueCancel } = useStores();
  const queryClient = useQueryClient();
  const { view } = useGalleryTreeContext();
  const { navigateToGroup } = useNavigationTools();

  const t = useTranslations('useRunImport');

  const [frame, setFrame] = useState('');
  const [createGroup, setCreateGroup] = useState<boolean>(rawImportQueue.length > 3 && stateCreateGroup);

  useEffect(() => {
    stateSetCreateGroup(createGroup);
  }, [createGroup, stateSetCreateGroup]);

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

  const runImport = useCallback(async (): Promise<void> => {
    if (!view) {
      return;
    }

    const { importQueue } = useImportsStore.getState();
    const queue = new Queue(1, Infinity);
    const now = Date.now();
    const savedImages = await Promise.all(sortByFilename(importQueue).map((image, index) => {
      const { tiles, fileName, meta, lastModified } = image;
      const { add } = tagChanges;
      const date = lastModified || now;
      return (
        queue.add(() => (
          saveNewImage({
            lines: importPad ? padToHeight(tiles) : tiles,
            filename: fileName,
            palette: activePalette,
            frame,
            tags: add,
            // Adding index to milliseconds to ensure proper sorting
            // see also src/hooks/useBatchUpdate.ts which adds the index after batch edit
            created: toCreationDate(date + index),
            meta,
          })
        ))
      );
    }));

    const imageHashes = savedImages.map(({ hash }) => hash);

    await addImages(savedImages);

    if (createGroup) {
      const title = t('importGroupTitle', { date: formatter(new Date()) });
      const slug = toSlug(title);

      cancelEditImageGroup();

      const newGroupId = randomId();

      const newImageGroup: SerializableImageGroup = {
        id: newGroupId,
        slug,
        title,
        isFavourite: false,
        created: toCreationDate(),
        coverImage: savedImages[0].hash,
        images: imageHashes,
        groups: [],
        tags: [],
      };

      await updateImageGroup(newImageGroup, view.id);
      await navigateToGroup(newGroupId, 0, false);
    }

    setImageSelection(imageHashes);
  }, [t, activePalette, updateImageGroup, addImages, cancelEditImageGroup, createGroup, formatter, frame, importPad, navigateToGroup, setImageSelection, tagChanges, view]);

  const palette = useActivePalette();

  const [stateImages, setStateImages] = useState<Map<string, Image>>(new Map());
  const [importQueue, setImportQueue] = useState<FlaggedImportItem[]>([]);

  useEffect(() => {
    const updateImportQueue = async () => {
      if (!rawImportQueue.length) {
        setImportQueue([]);
        return;
      }

      const rawQueueHashes = new Set<string>(rawImportQueue.map(({ imageHash }) => imageHash));
      const { items: storedImages } = await queryClient.fetchQuery(imagesByHashesQueryOptions([...rawQueueHashes]));
      const nextStateImages = new Map<string, Image>(storedImages.map((image) => [image.hash, image]));
      const seen = new Set<string>();

      const newImportQueue = rawImportQueue.map((importItem: ImportItem): FlaggedImportItem => {
        const alreadyImported = nextStateImages.get(importItem.imageHash) || null;
        const isDuplicateInQueue = seen.has(importItem.imageHash);

        seen.add(importItem.imageHash);

        return {
          ...importItem,
          isDuplicateInQueue,
          alreadyImported,
        };
      });

      setImportQueue(newImportQueue);
      setStateImages(nextStateImages);
    };

    updateImportQueue();
  }, [queryClient, rawImportQueue]);

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
