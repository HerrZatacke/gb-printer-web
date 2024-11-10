import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RGBNPalette } from 'gb-image-decoder';
import { loadImageTiles as getLoadImageTiles } from '../../../tools/loadImageTiles';
import { Actions } from '../../store/actions';
import { missingGreyPalette } from '../../defaults';
import type { State } from '../../store/State';
import type { RGBNHashes } from '../../../../types/Image';
import type { TryRecoverImageAction } from '../../../../types/actions/ImageActions';
import type { GameBoyImageProps } from '../GameBoyImage';
import type { Rotation } from '../../../tools/applyRotation';
import { loadFrameData } from '../../../tools/applyFrame/frameData';

interface UseImageRender {
  gbImageProps: GameBoyImageProps | null,
}

interface UseImageRenderParams {
  hash: string,
  hashes?: RGBNHashes,
  palette: string | string[] | RGBNPalette,
  invertPalette?: boolean,
  framePalette?: string[],
  invertFramePalette?: boolean,
  lockFrame?: boolean,
  frameId?: string,
  rotation?: Rotation,
}

export const useImageRender = ({
  hash,
  hashes,
  palette,
  invertPalette,
  framePalette,
  invertFramePalette,
  lockFrame,
  frameId,
  rotation,
}: UseImageRenderParams): UseImageRender => {
  const [gbImageProps, setGbImageProps] = useState<GameBoyImageProps | null>(null);

  const dispatch = useDispatch();

  const { allImages, allFrames, allPalettes, frameHash } = useSelector((state: State) => ({
    allImages: state.images,
    allFrames: state.frames,
    frameHash: state.frames.find(({ id }) => id === frameId)?.hash,
    allPalettes: state.palettes,
  }));

  const loadImageTiles = useCallback(
    (imgHash: string, noDummy?: boolean, overrideFrame?: string) => {
      const recoverFn = () => {
        dispatch<TryRecoverImageAction>({
          type: Actions.TRY_RECOVER_IMAGE_DATA,
          payload: imgHash,
        });
      };

      const imageLoader = getLoadImageTiles({ images: allImages, frames: allFrames }, recoverFn);

      return imageLoader(imgHash, noDummy, overrideFrame, hashes);
    },
    [allImages, allFrames, dispatch, hashes],
  );

  const usedPalette = useMemo<string[] | RGBNPalette>(() => {
    if (typeof palette === 'string') {
      return (allPalettes.find(({ shortName }) => shortName === palette) || missingGreyPalette).palette;
    }

    return palette;
  }, [allPalettes, palette]);

  useEffect(() => {
    let aborted = false;

    if (!hash) {
      setGbImageProps(null);
    }

    const loadTiles = async () => {
      // check before async call
      if (aborted) {
        return;
      }

      const loadedTiles = await loadImageTiles(hash, false, frameId);

      const frameData = frameHash ? await loadFrameData(frameHash) : null;

      const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

      // check after async call
      if (aborted) {
        return;
      }

      if (loadedTiles) {
        setGbImageProps({
          tiles: loadedTiles,
          palette: usedPalette,
          invertPalette,
          imageStartLine,
          lockFrame,
          rotation,
          framePalette: lockFrame ? framePalette : (palette as string[]),
          invertFramePalette: lockFrame ? invertFramePalette : invertPalette,
        });
      }
    };

    loadTiles();

    return () => {
      aborted = true;
    };
  }, [
    loadImageTiles,
    hash,
    frameId,
    palette,
    invertPalette,
    lockFrame,
    rotation,
    usedPalette,
    frameHash,
    framePalette,
    invertFramePalette,
  ]);

  return {
    gbImageProps,
  };
};
