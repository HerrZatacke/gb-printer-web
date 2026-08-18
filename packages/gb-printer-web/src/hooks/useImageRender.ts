import { type RGBNPalette } from 'gb-image-decoder';
import { useEffect, useMemo, useState } from 'react';
import { type GameBoyImageProps } from '@/components/GameBoyImage';
import { missingGreyPalette, defaultRGBNPalette } from '@/consts/defaults';
import { useFrames } from '@/hooks/useFrames';
import { useGalleryImage } from '@/hooks/useGalleryImage';
import { usePalettes } from '@/hooks/usePalettes';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import { loadImageTiles } from '@/tools/loadImageTiles';

export type PartialGameBoyImageProps = Omit<GameBoyImageProps, 'dimensions' | 'asThumb'>;

export interface Overrides extends Omit<GameBoyImageProps, 'dimensions' | 'asThumb' | 'tiles' | 'imageStartLine'> {
  frameId?: string;
  paletteId?: string;
  framePaletteId?: string;
}

interface UseImageRender {
  gbImageProps: PartialGameBoyImageProps | null;
}

export const useImageRender = (hash: string, overrides?: Overrides): UseImageRender => {
  const [gbImageProps, setGbImageProps] = useState<PartialGameBoyImageProps | null>(null);
  const { palettes: allPalettes } = usePalettes({ list: true });
  const { galleryImageData } = useGalleryImage(hash);

  const frameId = overrides?.frameId || galleryImageData?.frame;

  const isRGB = useMemo(() => {
    return  Boolean(galleryImageData?.hashes);
  }, [galleryImageData]);

  const { byIds: [foundFrame] } = useFrames({ ids: frameId ? [frameId] : [] });
  const frameHash = foundFrame?.hash;

  const invertPalette = useMemo(() => ((overrides?.invertPalette !== undefined) ?
    overrides.invertPalette :
    galleryImageData?.invertPalette), [galleryImageData, overrides]);

  const invertFramePalette = useMemo(() => ((overrides?.invertFramePalette !== undefined) ?
    overrides.invertFramePalette :
    galleryImageData?.invertFramePalette), [galleryImageData, overrides]);

  const lockFrame = useMemo(() => ((overrides?.lockFrame !== undefined) ?
    overrides.lockFrame :
    galleryImageData?.lockFrame), [galleryImageData, overrides]);

  const usedPalette = useMemo<string[] | RGBNPalette>(() => {
    if (overrides?.palette) { return overrides.palette; }

    if (overrides?.paletteId) {
      return (allPalettes.find(({ shortName }) => shortName === overrides.paletteId) || missingGreyPalette).palette;
    }

    if (galleryImageData) {
      return galleryImageData.palette;
    }

    return isRGB ? defaultRGBNPalette : missingGreyPalette.palette;
  }, [allPalettes, galleryImageData, isRGB, overrides]);

  const usedFramePalette = useMemo<string[] | undefined>(() => {
    if (overrides?.framePalette) { return overrides.framePalette; }

    if (isRGB || !lockFrame) { return undefined; }

    if (overrides?.framePaletteId) {
      return (allPalettes.find(({ shortName }) => shortName === overrides.framePaletteId) || missingGreyPalette).palette;
    }

    return galleryImageData ? galleryImageData.framePalette : missingGreyPalette.palette;
  }, [allPalettes, galleryImageData, isRGB, lockFrame, overrides]);

  useEffect(() => {
    let aborted = false;

    const loadTiles = async () => {
      if (!hash) {
        setGbImageProps(null);
      }

      // check before async call
      if (aborted) {
        return;
      }

      const loadedTiles = await loadImageTiles(hash, false, frameId || undefined, galleryImageData?.hashes);

      const frameData = frameHash ? await loadFrameData(frameHash) : null;

      const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

      // check after async call
      if (aborted) {
        return;
      }

      const rotation = overrides?.rotation || galleryImageData?.rotation;

      if (loadedTiles && galleryImageData) {
        setGbImageProps({
          tiles: loadedTiles,
          palette: usedPalette,
          framePalette: usedFramePalette,
          invertPalette,
          imageStartLine,
          lockFrame,
          rotation,
          invertFramePalette: lockFrame ? invertFramePalette : invertPalette,
        });
      }
    };

    const handle = window.setTimeout(loadTiles, 1);

    return () => {
      aborted = true;
      window.clearTimeout(handle);
    };
  }, [
    frameHash,
    frameId,
    galleryImageData,
    hash,
    invertFramePalette,
    invertPalette,
    loadImageTiles,
    lockFrame,
    overrides,
    usedFramePalette,
    usedPalette,
  ]);

  return {
    gbImageProps,
  };
};
