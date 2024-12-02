import dayjs from 'dayjs';
import { useState } from 'react';
import Queue from 'promise-queue';
import { useNavigate } from 'react-router-dom';
import saveNewImage from '../../../../tools/saveNewImage';
import padToHeight from '../../../../tools/padToHeight';
import sortBy from '../../../../tools/sortby';
import { dateFormat } from '../../../defaults';
import type { ImportItem } from '../../../../../types/ImportItem';
import type { TagChange } from '../../../../tools/applyTagChanges';
import { randomId } from '../../../../tools/randomId';
import { useGalleryTreeContext } from '../../../contexts/galleryTree';
import { toSlug } from '../EditImageGroup/useEditImageGroup';
import useEditStore from '../../../stores/editStore';
import useImportsStore from '../../../stores/importsStore';
import useItemsStore from '../../../stores/itemsStore';
import useSettingsStore from '../../../stores/settingsStore';
import { useStores } from '../../../../hooks/useStores';

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
  updateTagChanges: (updates: TagChange) => void,
}

const useRunImport = (): UseRunImport => {
  const { importPad, setActivePalette, activePalette } = useSettingsStore();
  const { cancelEditImageGroup } = useEditStore();
  const { addImageGroup } = useItemsStore();
  const { addImages, importQueueCancel } = useStores();

  const queue = new Queue(1, Infinity);
  const { view } = useGalleryTreeContext();
  const navigate = useNavigate();

  const { importQueue } = useImportsStore();

  const [frame, setFrame] = useState('');
  const [createGroup, setCreateGroup] = useState<boolean>(importQueue.length > 3);

  const [tagChanges, updateTagChanges] = useState<TagChange>({
    initial: [],
    add: [],
    remove: [],
  });

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
      const title = `Import ${dayjs().format(dateFormat)}`;
      const slug = toSlug(title);

      cancelEditImageGroup();

      // ToDo: Handle jumping to wrong folder when creating group in sub-view

      addImageGroup(
        {
          id: randomId(),
          slug,
          title,
          created: dayjs(Date.now()).format(dateFormat),
          coverImage: savedImages[0].hash,
          images: imageHashes,
          groups: [],
        },
        view.id,
      );

      navigate(`/gallery/${view.slug}${slug}/page/1`);
    }

    // ToDo: which images should become selected? setSelection(imageHahses)??
  };

  return {
    importQueue,
    importPad,
    palette: activePalette,
    frame,
    tagChanges,
    createGroup,
    updateTagChanges,
    setFrame,
    setCreateGroup,
    runImport,
    cancelImport: importQueueCancel,
    setActivePalette,
  };
};

export default useRunImport;
