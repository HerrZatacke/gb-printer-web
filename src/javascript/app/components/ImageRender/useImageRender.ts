import { useDispatch, useSelector } from 'react-redux';
import { RGBNTiles } from 'gb-image-decoder';
import getLoadImageTiles, { PImage } from '../../../tools/loadImageTiles';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';

interface UseImageRender {
  loadImageTiles: (image: PImage, noDummy?: boolean) => Promise<string[] | RGBNTiles | void>,
}

export const useImageRender = (hash: string): UseImageRender => {
  const dispatch = useDispatch();

  const recoverFn = () => {
    dispatch({
      type: Actions.TRY_RECOVER_IMAGE_DATA,
      payload: hash,
    });
  };

  const loadImageTiles = useSelector((state: State) => getLoadImageTiles(state, recoverFn));

  return {
    loadImageTiles,
  };
};
