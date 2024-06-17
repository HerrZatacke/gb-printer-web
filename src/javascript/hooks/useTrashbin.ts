import { useDispatch, useSelector, useStore } from 'react-redux';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { localforageReady, localforageImages, localforageFrames } from '../tools/localforageInstance';
import { Actions } from '../app/store/actions';
import { dateFormat } from '../app/defaults';
import { cleanupStorage, getTrashImages, getTrashFrames } from '../tools/getTrash';
import { inflate } from '../tools/pack';
import type { WrappedLocalForageInstance } from '../tools/localforageInstance/createWrappedInstance';
import type { TrashShowHideAction, UpdateTrashcountAction } from '../../types/actions/TrashActions';
import { reduceImagesMonochrome } from '../tools/isRGBNImage';
import type { JSONExportBinary, JSONExportState, State, TypedStore } from '../app/store/State';
import type { Image } from '../../types/Image';
import { reduceItems } from '../tools/reduceArray';
import type { Frame } from '../../types/Frame';
import type { TrashCount } from '../app/store/reducers/trashCountReducer';

export interface UseTrashbin {
  showTrash: (show: boolean) => void
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
  const trashCount = useSelector((state: State) => (state.trashCount));

  const store: TypedStore = useStore();
  const dispatch = useDispatch();

  const showTrash = (show: boolean): void => {
    dispatch<TrashShowHideAction>({
      type: Actions.SHOW_HIDE_TRASH,
      payload: show,
    });
  };

  const downloadImages = async (): Promise<void> => {
    const imageHashes = await getTrashImages(store.getState().images.reduce(reduceImagesMonochrome, []));
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
    const frameHashes = await getTrashFrames(store.getState().frames);
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
        frameGroupNames: [
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
    await cleanupStorage(store.getState());

    dispatch<UpdateTrashcountAction>({
      type: Actions.UPDATE_TRASH_COUNT,
    });

    showTrash(false);
  };

  return {
    showTrash,
    purgeTrash,
    downloadImages,
    downloadFrames,
    trashCount,
  };
};

export default useTrashbin;
