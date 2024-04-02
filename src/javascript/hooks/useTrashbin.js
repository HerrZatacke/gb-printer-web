import { useDispatch, useSelector, useStore } from 'react-redux';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { localforageReady, localforageImages, localforageFrames } from '../tools/localforageInstance';
import { Actions } from '../app/store/actions';
import { dateFormat } from '../app/defaults';
import { cleanupStorage, getTrashImages, getTrashFrames } from '../tools/getTrash';

const getItems = async (keys, storage) => {
  await localforageReady();
  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');
  return (
    Promise.all(keys.map((hash) => (
      storage.getItem(hash)
        .then((binary) => {
          const inflated = pako.inflate(binary, { to: 'string' });
          return {
            hash,
            lines: inflated.split('\n'),
            binary,
          };
        })
        .catch(() => null)
    )))
  );
};

const useTrashbin = () => {
  const trashCount = useSelector((state) => (state.trashCount));
  const sum = (trashCount?.frames || 0) + (trashCount?.images || 0);

  const store = useStore();
  const dispatch = useDispatch();

  const showTrash = (show) => {
    dispatch({
      type: Actions.SHOW_HIDE_TRASH,
      payload: show,
    });
  };

  const downloadImages = async () => {
    const imageHashes = await getTrashImages(store.getState().images);
    const deletedImages = await getItems(imageHashes, localforageImages);

    const jsonBackup = { state: {} };
    const backupImages = deletedImages.map((image) => {
      try {
        jsonBackup[image.hash] = image.binary;
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
    }).filter(Boolean);

    jsonBackup.state.images = backupImages;

    saveAs(new Blob([...JSON.stringify(jsonBackup, null, 2)]), 'backup_images.json');
  };

  const downloadFrames = async () => {
    const frameHashes = await getTrashFrames(store.getState().frames);
    const deletedFrames = await getItems(frameHashes, localforageFrames);

    const jsonBackup = { state: {} };
    const backupFrames = deletedFrames.map((frame, index) => {
      try {
        jsonBackup[`frame-${frame.hash}`] = frame.binary;
        return {
          hash: frame.hash,
          name: `Backup export ${frame.hash}`,
          id: `bak${index.toString(10).padStart(2, '0')}`,
        };
      } catch (error) {
        return null;
      }
    }).filter(Boolean);

    jsonBackup.state.frames = backupFrames;

    jsonBackup.state.frameGroupNames = [
      {
        id: 'bak',
        name: 'Re-imported trash frames',
      },
    ];

    saveAs(new Blob([...JSON.stringify(jsonBackup, null, 2)]), 'backup_frames.json');
  };

  const purgeTrash = async () => {
    await cleanupStorage(store.getState());

    dispatch({
      type: Actions.UPDATE_TRASH_COUNT,
    });

    showTrash(false);
  };

  return {
    showTrash,
    purgeTrash,
    downloadImages,
    downloadFrames,
    trashCount: {
      ...trashCount,
      sum,
    },
  };
};

export default useTrashbin;
