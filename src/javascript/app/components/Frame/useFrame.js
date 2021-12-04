import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DELETE_FRAME } from '../../store/actions';
import applyFrame from '../../../tools/applyFrame';
import textToTiles from '../../../tools/textToTiles';

const getTiles = ({ frameId, frameHash, name }) => {
  const text = `\n  frameId: ${frameId}\n\n  ${name}`;
  return applyFrame(textToTiles(text), frameHash);
};

const useFrame = ({ frameId, name }) => {
  const dispatch = useDispatch();
  const [tiles, setTiles] = useState(null);
  const frameHash = useSelector(({ frames }) => frames.find(({ id }) => id === frameId).hash);

  useEffect(() => {
    let mounted = true;
    getTiles({
      frameId,
      frameHash,
      name,
    }).then((t) => {
      if (mounted) {
        setTiles(t);
      }
    });

    return () => {
      mounted = false;
    };
  }, [frameId, frameHash, name]);

  const deleteFrame = (deleteFrameId) => dispatch({
    type: DELETE_FRAME,
    payload: deleteFrameId,
  });

  return {
    tiles,
    setTiles,
    deleteFrame,
  };
};

export default useFrame;
