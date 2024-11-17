import { useSelector, useStore } from 'react-redux';
import { useEffect, useState } from 'react';
import applyFrame from '../../../tools/applyFrame';
import textToTiles from '../../../tools/textToTiles';
import type { State, TypedStore } from '../../store/State';
import { loadFrameData } from '../../../tools/applyFrame/frameData';
import { checkUpdateTrashCount } from '../../../tools/checkUpdateTrashCount';
import useDialogsStore from '../../stores/dialogsStore';
import useEditStore from '../../stores/editStore';
import useItemsStore from '../../stores/itemsStore';
import useSettingsStore from '../../stores/settingsStore';
import useStoragesStore from '../../stores/storagesStore';


interface GetTilesParams {
  frameId: string,
  frameHash: string,
  name: string,
}

interface UseFrameParams {
  frameId: string,
  name: string,
}

interface UseFrame {
  frameHash: string,
  tiles: string[],
  imageStartLine: number,
  setTiles: (tiles: string[]) => void,
  deleteFrame: () => void,
  editFrame: () => void,
  enableDebug: boolean,
  usage: number,
}

const getTiles = ({ frameId, frameHash, name }: GetTilesParams) => {
  const text = `\n  frameId: ${frameId}\n\n  ${name}\n\n${frameHash}`;
  return applyFrame(textToTiles(text), frameHash);
};

const useFrame = ({ frameId, name }: UseFrameParams): UseFrame => {
  const [tiles, setTiles] = useState<string[]>([]);
  const [imageStartLine, setImageStartLine] = useState<number>(2);

  const store: TypedStore = useStore();

  const { setEditFrame } = useEditStore();
  const { enableDebug } = useSettingsStore();
  const { dismissDialog, setDialog } = useDialogsStore();
  const { frames, deleteFrame } = useItemsStore();
  const { setSyncLastUpdate } = useStoragesStore();

  const frameHash = frames.find(({ id }) => id === frameId)?.hash || '';

  const {
    usage,
  } = useSelector((state: State) => ({
    usage: state.images.filter(({ frame }) => frame === frameId).length,
  }));

  useEffect(() => {
    setImageStartLine(2);
    setTiles([]);

    const get = async () => {
      if (!frameHash) {
        return;
      }

      const frameData = await loadFrameData(frameHash);
      const newTiles = await getTiles({ frameId, frameHash, name });

      setImageStartLine(frameData ? frameData.upper.length / 20 : 2);
      setTiles(newTiles);
    };

    get();
  }, [frameId, frameHash, name]);

  return {
    frameHash,
    tiles,
    imageStartLine,
    enableDebug,
    usage,
    setTiles,
    deleteFrame: () => {
      setDialog({
        message: `Delete frame "${name}" (${frameId})?`,
        confirm: async () => {
          dismissDialog(0);
          setSyncLastUpdate('local', Math.floor((new Date()).getTime() / 1000));
          deleteFrame(frameId);
          checkUpdateTrashCount(store.getState().images, useItemsStore.getState().frames);
        },
        deny: async () => dismissDialog(0),
      });
    },
    editFrame: () => setEditFrame(frameId),
  };
};

export default useFrame;
