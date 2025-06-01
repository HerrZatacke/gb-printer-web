import dayjs from 'dayjs';
import Queue from 'promise-queue';
import { useState } from 'react';
import { dateFormat, dateFormatSeconds } from '@/consts/defaults';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { useNavigationToolsContext } from '@/contexts/navigationTools/NavigationToolsProvider';
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
import type { ImportItem } from '@/types/ImportItem';
import { toSlug } from './useEditImageGroup';

const sortByFilename = sortBy<ImportItem>('fileName');

interface UseRunImport {
  importQueue: ImportItem[],
  palette: string,
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
}

const useRunImport = (): UseRunImport => {
  const { importPad, setActivePalette, activePalette } = useSettingsStore();
  const { cancelEditImageGroup } = useEditStore();
  const { addImageGroup } = useItemsStore();
  const { setImageSelection } = useFiltersStore();
  const { addImages, importQueueCancel } = useStores();

  const queue = new Queue(1, Infinity);
  const { view } = useGalleryTreeContext();
  const { navigateToGroup } = useNavigationToolsContext();

  const { importQueue } = useImportsStore();

  const [frame, setFrame] = useState('');
  const [createGroup, setCreateGroup] = useState<boolean>(importQueue.length > 3);

  const [tagChanges, updateTagChanges] = useState<TagChange>({
    initial: [],
    add: [],
    remove: [],
  });

  const resetTagChanges = () => {
    updateTagChanges(({ initial }) => ({
      initial,
      add: [],
      remove: [],
    }));
  };

  const runImport = async () => {
    const savedImages = await Promise.all(sortByFilename(importQueue).map((image, index) => {
      const { tiles, fileName, meta, lastModified } = image;

      return (
        queue.add(() => (
          saveNewImage({
            lines: importPad ? padToHeight(tiles) : tiles,
            filename: fileName,
            palette: activePalette,
            frame,
            tags: tagChanges.add,
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
      const title = `Import ${dayjs().format(dateFormatSeconds)}`;
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
  };

  return {
    importQueue,
    importPad,
    palette: activePalette,
    frame,
    tagChanges,
    createGroup,
    updateTagChanges,
    resetTagChanges,
    setFrame,
    setCreateGroup,
    runImport,
    cancelImport: importQueueCancel,
    setActivePalette,
  };
};

export default useRunImport;
