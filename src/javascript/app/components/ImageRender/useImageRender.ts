import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RGBNPalette } from 'gb-image-decoder';
import { loadImageTiles as getLoadImageTiles } from '../../../tools/loadImageTiles';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import { RGBNHashes } from '../../../../types/Image';
import { TryRecoverImageAction } from '../../../../types/actions/ImageActions';
import { GameBoyImageProps } from '../GameBoyImage';
import { Rotation } from '../../../tools/applyRotation';

interface UseImageRender {
  gbImageProps: GameBoyImageProps | null,
}

interface UseImageRenderParams {
  hash: string,
  hashes?: RGBNHashes,
  palette: string[] | RGBNPalette,
  invertPalette: boolean,
  lockFrame: boolean,
  frameId?: string,
  rotation?: Rotation,
}

export const useImageRender = ({
  hash,
  hashes,
  palette,
  invertPalette,
  lockFrame,
  frameId,
  rotation,
}: UseImageRenderParams): UseImageRender => {
  const [gbImageProps, setGbImageProps] = useState<GameBoyImageProps | null>(null);

  const dispatch = useDispatch();

  const { allImages, allFrames } = useSelector((state: State) => ({
    allImages: state.images,
    allFrames: state.frames,
  }));

  const loadImageTiles = useCallback(
    (imgHash: string, noDummy?: boolean, overrideFrame?: string) => {
      const recoverFn = () => {
        dispatch({
          type: Actions.TRY_RECOVER_IMAGE_DATA,
          payload: imgHash,
        } as TryRecoverImageAction);
      };

      const imageLoader = getLoadImageTiles({ images: allImages, frames: allFrames }, recoverFn);

      return imageLoader(imgHash, noDummy, overrideFrame, hashes);
    },
    [allImages, allFrames, dispatch, hashes],
  );


  useEffect(() => {
    let aborted = false;

    setGbImageProps(null);

    const loadTiles = async () => {
      if (aborted) {
        return;
      }

      const loadedTiles = await loadImageTiles(hash, false, frameId);

      if (loadedTiles) {
        setGbImageProps({
          tiles: loadedTiles,
          palette,
          invertPalette,
          lockFrame,
          rotation,
        });
      }
    };

    loadTiles();

    return () => {
      aborted = true;
    };
  }, [loadImageTiles, hash, frameId, palette, invertPalette, lockFrame, rotation]);

  return {
    gbImageProps,
  };
};
