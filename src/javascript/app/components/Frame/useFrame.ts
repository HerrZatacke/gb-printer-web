import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Actions } from '../../store/actions';
import applyFrame from '../../../tools/applyFrame';
import textToTiles from '../../../tools/textToTiles';
import { State } from '../../store/State';
import { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';
import { EditFrameAction } from '../../store/reducers/editFrameReducer';
import { DeleteFrameAction } from '../../../../types/actions/FrameActions';


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
  setTiles: (tiles: string[]) => void,
  deleteFrame: () => void,
  editFrame: () => void,
  enableDebug: boolean,
}

const getTiles = ({ frameId, frameHash, name }: GetTilesParams) => {
  const text = `\n  frameId: ${frameId}\n\n  ${name}\n\n${frameHash}`;
  return applyFrame(textToTiles(text), frameHash);
};

const useFrame = ({ frameId, name }: UseFrameParams): UseFrame => {
  const dispatch = useDispatch();
  const [tiles, setTiles] = useState<string[]>([]);
  const {
    frameHash,
    enableDebug,
  } = useSelector((state: State) => ({
    frameHash: state.frames.find(({ id }) => id === frameId)?.hash || '',
    enableDebug: state.enableDebug,
  }));

  useEffect(() => {
    const get = async () => {
      if (!frameHash) {
        return;
      }

      const newTiles = await getTiles({ frameId, frameHash, name });
      setTiles(newTiles);
    };

    get();
  }, [frameId, frameHash, name]);

  return {
    frameHash,
    tiles,
    enableDebug,
    setTiles,
    deleteFrame: () => {
      dispatch({
        type: Actions.CONFIRM_ASK,
        payload: {
          message: `Delete frame "${name}" (${frameId})?`,
          confirm: () => {
            dispatch({
              type: Actions.DELETE_FRAME,
              payload: frameId,
            } as DeleteFrameAction);
          },
          deny: () => {
            dispatch({
              type: Actions.CONFIRM_ANSWERED,
            } as ConfirmAnsweredAction);
          },
        },
      } as ConfirmAskAction);
    },
    editFrame: () => {
      dispatch({
        type: Actions.EDIT_FRAME,
        payload: frameId,
      } as EditFrameAction);
    },
  };
};

export default useFrame;
