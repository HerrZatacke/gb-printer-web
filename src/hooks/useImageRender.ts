import { type RGBNPalette } from 'gb-image-decoder';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type GameBoyImageProps } from '@/components/GameBoyImage';
import { missingGreyPalette, defaultRGBNPalette } from '@/consts/defaults';
import useGapiSync from '@/contexts/GapiSyncContext';
import { useGalleryImage } from '@/hooks/useGalleryImage';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useStores } from '@/hooks/useStores';
import { useItemsStore, useStoragesStore } from '@/stores/stores';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import { dropboxStorageTool } from '@/tools/dropboxStorage';
import { type RGBNHashes } from '@/types/Image';
import { loadImageTiles as getLoadImageTiles } from '../tools/loadImageTiles';

export type PartialGameBoyImageProps = Omit<GameBoyImageProps, 'dimensions' | 'asThumb'>;

export interface Overrides extends Omit<GameBoyImageProps, 'dimensions' | 'asThumb' | 'tiles' | 'imageStartLine'> {
  frameId?: string;
  paletteId?: string;
  framePaletteId?: string;
}

interface UseImageRender {
  gbImageProps: PartialGameBoyImageProps | null,
}

export const useImageRender = (hash: string, overrides?: Overrides): UseImageRender => {
  const [gbImageProps, setGbImageProps] = useState<PartialGameBoyImageProps | null>(null);
  const stores = useStores();
  const { remoteImport } = useImportExportSettings();
  const { frames: allFrames, palettes: allPalettes, images: allImages } = useItemsStore();
  const { gapiStorage, dropboxStorage, gitStorage } = useStoragesStore();
  const { recoverImage } = useGapiSync();
  const { galleryImageData } = useGalleryImage(hash);

  const frameId = overrides?.frameId || galleryImageData?.frame;

  const loadImageTiles = useCallback(
    (imgHash: string, noDummy?: boolean, overrideFrame?: string, hashesOverride?: RGBNHashes) => {
      const recoverFn = async () => {
        console.log(`🗃️ recovering ${imgHash}`);
        let recovered = false;
        if (gapiStorage.use) {
          console.log('🗃️ from gapi storage');
          recovered = recoverImage(imgHash);
          if (!recovered) {
            console.log('🗃️ ...failed');
          }
        }

        if (!recovered && dropboxStorage.use) {
          console.log('🗃️ from dropbox storage');
          recovered = await dropboxStorageTool(stores, remoteImport).recoverImageData(imgHash);
          if (!recovered) {
            console.log('🗃️ ...failed');
          }
        }

        if (!recovered && gitStorage.use) {
          console.log('🗃️ recovering from git storage is not a feature');
        } else {
          if (recovered) {
            console.log('🗃️ recovery successfull');
          } else {
            console.log('🗃️ recovery failed');
          }
        }
      };

      const imageLoader = getLoadImageTiles(allImages, allFrames, recoverFn);

      return imageLoader(imgHash, noDummy, overrideFrame, hashesOverride);
    },
    [allImages, allFrames, gapiStorage.use, dropboxStorage.use, gitStorage.use, recoverImage, stores, remoteImport],
  );

  const isRGB = useMemo(() => {
    return  Boolean(galleryImageData?.hashes);
  }, [galleryImageData]);

  const frameHash = useMemo(() => (
    allFrames.find(({ id }) => id === frameId)?.hash
  ), [allFrames, frameId]);

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

      const loadedTiles = await loadImageTiles(hash, false, frameId, galleryImageData?.hashes);

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
