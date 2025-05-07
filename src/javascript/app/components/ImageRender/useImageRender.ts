import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RGBNPalette, Rotation } from 'gb-image-decoder';
import useItemsStore from '../../stores/itemsStore';
import { loadImageTiles as getLoadImageTiles } from '../../../tools/loadImageTiles';
import { missingGreyPalette } from '../../defaults';
import type { RGBNHashes } from '../../../../types/Image';
import type { GameBoyImageProps } from '../GameBoyImage';
import { loadFrameData } from '../../../tools/applyFrame/frameData';
import { dropboxStorageTool } from '../../../tools/dropboxStorage';
import { useStores } from '../../../hooks/useStores';
import { useImportExportSettings } from '../../../hooks/useImportExportSettings';

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
  const stores = useStores();
  const { remoteImport } = useImportExportSettings();
  const { frames: allFrames, palettes: allPalettes, images: allImages } = useItemsStore();
  const frameHash = allFrames.find(({ id }) => id === frameId)?.hash;

  const loadImageTiles = useCallback(
    (imgHash: string, noDummy?: boolean, overrideFrame?: string) => {
      const recoverFn = () => {
        dropboxStorageTool(stores, remoteImport).recoverImageData(imgHash);
      };

      const imageLoader = getLoadImageTiles(allImages, allFrames, recoverFn);

      return imageLoader(imgHash, noDummy, overrideFrame, hashes);
    },
    [allImages, allFrames, hashes, stores, remoteImport],
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
