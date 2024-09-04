import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Actions } from '../../store/actions';
import applyFrame from '../../../tools/applyFrame';
import textToTiles from '../../../tools/textToTiles';
import type { State } from '../../store/State';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';
import type { DeleteFrameAction, EditFrameAction } from '../../../../types/actions/FrameActions';
import { loadFrameData } from '../../../tools/applyFrame/frameData';


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
  const dispatch = useDispatch();
  const [tiles, setTiles] = useState<string[]>([]);
  const [imageStartLine, setImageStartLine] = useState<number>(2);

  const {
    frameHash,
    enableDebug,
    usage,
  } = useSelector((state: State) => ({
    frameHash: state.frames.find(({ id }) => id === frameId)?.hash || '',
    enableDebug: state.enableDebug,
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
      dispatch<ConfirmAskAction>({
        type: Actions.CONFIRM_ASK,
        payload: {
          message: `Delete frame "${name}" (${frameId})?`,
          confirm: async () => {
            dispatch<DeleteFrameAction>({
              type: Actions.DELETE_FRAME,
              payload: frameId,
            });
          },
          deny: async () => {
            dispatch<ConfirmAnsweredAction>({
              type: Actions.CONFIRM_ANSWERED,
            });
          },
        },
      });
    },
    editFrame: () => {
      dispatch<EditFrameAction>({
        type: Actions.EDIT_FRAME,
        payload: frameId,
      });
    },
  };
};

export default useFrame;
