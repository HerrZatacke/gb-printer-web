import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { DELETE_FRAME } from '../../store/actions';
import applyFrame from '../../../tools/applyFrame';
import textToTiles from '../../../tools/textToTiles';

const getTiles = ({ frameId, frameHash, name }) => {
  const text = `\n  frameId: ${frameId}\n\n  ${name}\n\n${frameHash}`;
  return applyFrame(textToTiles(text), frameHash);
};

const useFrame = ({ frameId, name }) => {
  const dispatch = useDispatch();
  const [tiles, setTiles] = useState(null);
  const frameHash = useSelector(({ frames }) => frames.find(({ id }) => id === frameId))?.hash;
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (mounted.current) {
      getTiles({
        frameId,
        frameHash,
        name,
      })
        .then(setTiles);
    }

    return () => {
      mounted.current = false;
    };
  }, [frameId, frameHash, name]);

  const deleteFrame = () => {
    mounted.current = false;
    dispatch({
      type: DELETE_FRAME,
      payload: frameId,
    });
  };

  return {
    tiles,
    setTiles,
    deleteFrame,
  };
};

export default useFrame;
