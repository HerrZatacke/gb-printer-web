import dayjs from 'dayjs';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Queue from 'promise-queue';
import { useNavigate } from 'react-router-dom';
import { Actions } from '../../../store/actions';
import saveNewImage from '../../../../tools/saveNewImage';
import padToHeight from '../../../../tools/padToHeight';
import sortBy from '../../../../tools/sortby';
import { dateFormat } from '../../../defaults';
import type { State } from '../../../store/State';
import type { ImportItem } from '../../../../../types/ImportItem';
import type { ImportQueueCancelAction } from '../../../../../types/actions/QueueActions';
import type { TagChange } from '../../../../tools/applyTagChanges';
import type { AddImagesAction } from '../../../../../types/actions/ImageActions';
import type { AddImageGroupAction } from '../../../../../types/actions/GroupActions';
import type { ImageSelectionSetAction } from '../../../../../types/actions/ImageSelectionActions';
import { randomId } from '../../../../tools/randomId';
import { useGalleryTreeContext } from '../../../contexts/galleryTree';
import { toSlug } from '../EditImageGroup/useEditImageGroup';
import useSettingsStore from '../../../stores/settingsStore';

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
  const dispatch = useDispatch();
  const queue = new Queue(1, Infinity);
  const { view } = useGalleryTreeContext();
  const navigate = useNavigate();

  const { importQueue } = useSelector((state: State) => ({
    importQueue: state.importQueue,
  }));

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

    dispatch<AddImagesAction>({
      type: Actions.ADD_IMAGES,
      payload: savedImages,
    });

    if (createGroup) {
      const title = `Import ${dayjs().format(dateFormat)}`;
      const slug = toSlug(title);

      dispatch<AddImageGroupAction>({
        type: Actions.ADD_IMAGE_GROUP,
        payload: {
          parentId: view.id,
          group: {
            id: randomId(),
            slug,
            title,
            created: dayjs(Date.now()).format(dateFormat),
            coverImage: savedImages[0].hash,
            images: imageHashes,
            groups: [],
          },
        },
      });

      navigate(`/gallery/${view.slug}${slug}/page/1`);
    }

    dispatch<ImageSelectionSetAction>({
      type: Actions.IMAGE_SELECTION_SET,
      payload: imageHashes,
    });
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
    cancelImport: () => {
      dispatch<ImportQueueCancelAction>({
        type: Actions.IMPORTQUEUE_CANCEL,
      });
    },
    setActivePalette,
  };
};

export default useRunImport;
