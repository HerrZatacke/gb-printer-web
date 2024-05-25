import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RGBNTiles } from 'gb-image-decoder';
import getLoadImageTiles, { PImage } from '../../../tools/loadImageTiles';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import { Image } from '../../../../types/Image';
import { TryRecoverImageAction } from '../../../../types/actions/ImageActions';

interface UseImageRender {
  loadImageTiles: (image: Image | PImage, noDummy?: boolean) => Promise<string[] | RGBNTiles | void>,
}

export const useImageRender = (hash: string): UseImageRender => {
  const dispatch = useDispatch();

  const { images, frames } = useSelector((state: State) => ({
    images: state.images,
    frames: state.frames,
  }));

  const loadImageTiles = useCallback(
    (image: Image | PImage, noDummy?: boolean) => {
      const recoverFn = () => {
        dispatch({
          type: Actions.TRY_RECOVER_IMAGE_DATA,
          payload: hash,
        } as TryRecoverImageAction);
      };

      const imageLoader = getLoadImageTiles({ images, frames }, recoverFn);

      return imageLoader(image, noDummy);
    },
    [images, frames, dispatch, hash],
  );

  return {
    loadImageTiles,
  };
};
