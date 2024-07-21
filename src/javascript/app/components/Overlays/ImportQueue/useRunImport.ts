import dayjs from 'dayjs';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Queue from 'promise-queue';
import { Actions } from '../../../store/actions';
import saveNewImage from '../../../../tools/saveNewImage';
import padToHeight from '../../../../tools/padToHeight';
import sortBy from '../../../../tools/sortby';
import { dateFormat } from '../../../defaults';
import type { State } from '../../../store/State';
import type { PaletteSetActiveAction } from '../../../../../types/actions/PaletteActions';
import type { ImportItem } from '../../../../../types/ImportItem';
import type { ImportQueueCancelAction } from '../../../../../types/actions/QueueActions';
import type { TagChange } from '../../../../tools/applyTagChanges';
import type { AddImagesAction } from '../../../../../types/actions/ImageActions';

const sortByFilename = sortBy<ImportItem>('fileName');

interface UseRunImport {
  importQueue: ImportItem[],
  palette: string,
  importPad: boolean,
  frame: string,
  setFrame: (frame: string) => void,
  setPalette: (palette: string) => void,
  runImport: () => Promise<void>,
  cancelImport: () => void,
  tagChanges: TagChange,
  updateTagChanges: (updates: TagChange) => void,
}

const useRunImport = (): UseRunImport => {
  const dispatch = useDispatch();
  const queue = new Queue(1, Infinity);

  const { importQueue, palette, importPad } = useSelector((state: State) => ({
    importPad: state.importPad,
    palette: state.activePalette || '',
    importQueue: state.importQueue,
  }));

  const [frame, setFrame] = useState('');

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
            palette,
            frame,
            tags: tagChanges.add,
            // Adding index to milliseconds to ensure better sorting
            created: dayjs((lastModified || Date.now()) + index).format(dateFormat),
            meta,
          })
        ))
      );
    }));

    dispatch<AddImagesAction>({
      type: Actions.ADD_IMAGES,
      payload: savedImages,
    });
  };

  return {
    importQueue,
    importPad,
    palette,
    frame,
    tagChanges,
    updateTagChanges,
    setFrame,
    runImport,
    cancelImport: () => {
      dispatch<ImportQueueCancelAction>({
        type: Actions.IMPORTQUEUE_CANCEL,
      });
    },
    setPalette: (payload: string) => {
      dispatch<PaletteSetActiveAction>({
        type: Actions.PALETTE_SET_ACTIVE,
        payload,
      });
    },
  };
};

export default useRunImport;
