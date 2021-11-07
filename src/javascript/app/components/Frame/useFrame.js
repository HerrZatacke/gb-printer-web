import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { DELETE_FRAME } from '../../store/actions';
import applyFrame from '../../../tools/applyFrame';
import textToTiles from '../../../tools/textToTiles';

const getTiles = ({ id, name }) => {
  const text = `\n  ID: ${id}\n\n  ${name}`;
  return applyFrame(textToTiles(text), id);
};

const useFrame = ({ id, name }) => {
  const dispatch = useDispatch();
  const [tiles, setTiles] = useState(null);


  useEffect(() => {
    let mounted = true;
    getTiles({
      id,
      name,
    }).then((t) => {
      if (mounted) {
        setTiles(t);
      }
    });

    return () => {
      mounted = false;
    };
  }, [id, name]);

  const deleteFrame = (frameId) => dispatch({
    type: DELETE_FRAME,
    payload: frameId,
  });

  return {
    tiles,
    setTiles,
    deleteFrame,
  };
};

export default useFrame;
