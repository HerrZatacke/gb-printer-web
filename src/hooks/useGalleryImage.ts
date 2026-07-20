import { useQueryClient } from '@tanstack/react-query';
import { type RGBNPalette, type Rotation } from 'gb-image-decoder';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { missingGreyPalette } from '@/consts/defaults';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useImageByHash } from '@/hooks/useImageByHash';
import { useImages } from '@/hooks/useImages';
import { hashesByGroupIdQueryOptions } from '@/stores/queries/images';
import {
  type ImageSelectionMode,
  useFiltersStore,
} from '@/stores/stores';
import { getImagePalettes, ImagePalettes } from '@/tools/getImagePalettes';
import { getPaletteSettings } from '@/tools/getPaletteSettings';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { type MonochromeImage, type RGBNHashes, type RGBNImage } from '@/types/Image';
import { type Palette } from '@/types/Palette';

export const SelectionEditMode = {
  ADD: 'add',
  REMOVE: 'remove',
} as const;
export type SelectionEditMode = (typeof SelectionEditMode)[keyof typeof SelectionEditMode];

interface GalleryImageData {
  title: string;
  created: string;
  frame?: string;
  hashes?: RGBNHashes;
  tags: string[];
  selectionIndex: number;
  palette: RGBNPalette | string[];
  framePalette: string[];
  lockFrame?: boolean;
  invertPalette?: boolean;
  invertFramePalette?: boolean;
  rotation?: Rotation;
}

interface UseGalleryImage {
  galleryImageData: GalleryImageData | null;
  updateImageSelection: (mode: ImageSelectionMode, shift: boolean) => void;
}

export const useGalleryImage = (hash: string): UseGalleryImage => {
  const queryClient = useQueryClient();

  const {
    imageSelection,
    updateImageSelection: storeUpdateImageSelection,
    lastSelectedImage,
    setImageSelection,
  } = useFiltersStore();

  const { image: stateImage } = useImageByHash(hash);
  const { imageQueryParams } = useImages({});

  const selectionIndex = imageSelection.indexOf(hash);

  const [imagePalettes, setImagePalettes] = useState<ImagePalettes | null>(null);
  useEffect(() => {
    let cancelled = false;

    if (stateImage) {
      getImagePalettes(stateImage)
        .then((data) => {
          if (!cancelled) {
            setImagePalettes(data);
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [stateImage]);

  const galleryImageData = useMemo((): GalleryImageData | null => {

    let palette: RGBNPalette | string[];
    let framePalette: string[] = [];

    if (!stateImage || !imagePalettes) {
      return null;
    }

    const {
      palette: selectedPalette,
      framePalette: selectedFramePalette,
    } = imagePalettes;

    const { invertPalette, invertFramePalette } = getPaletteSettings(stateImage as MonochromeImage);

    if (!selectedPalette) {
      throw new Error('Palette missing?');
    }

    if (isRGBNImage(stateImage)) {
      palette = selectedPalette as RGBNPalette;
    } else {
      palette = ((selectedPalette || missingGreyPalette) as Palette).palette;
      framePalette = (selectedFramePalette || missingGreyPalette).palette;
    }


    return ({
      title: stateImage.title,
      created: stateImage.created,
      frame: stateImage.frame,
      hashes: (stateImage as RGBNImage).hashes || undefined,
      tags: stateImage.tags,
      palette,
      framePalette,
      lockFrame: stateImage.lockFrame,
      invertPalette,
      invertFramePalette,
      rotation: stateImage.rotation,
      selectionIndex,
    });
  }, [selectionIndex, stateImage, imagePalettes]);

  const { view } = useGalleryTreeContext();

  const updateImageSelection = useCallback(async (mode: ImageSelectionMode, shift: boolean): Promise<void> => {
    if (!view) {
      return;
    }

    if (shift) {
      const { items: imageHashes } = await queryClient.fetchQuery(hashesByGroupIdQueryOptions(view.id, false, imageQueryParams.sort, imageQueryParams.filters));

      console.log({ imageHashes, viewImageHashes: view.images });

      const selectedIndex = imageHashes.findIndex((findHash) => findHash === hash);

      let prevSelectedIndex = imageHashes.findIndex((findHash) => findHash === lastSelectedImage);

      if (prevSelectedIndex === -1) {
        prevSelectedIndex = 0;
      }

      const from = Math.min(prevSelectedIndex, selectedIndex);
      const to = Math.max(prevSelectedIndex, selectedIndex);

      setImageSelection(imageHashes.slice(from, to + 1));
    } else {
      storeUpdateImageSelection(mode, [hash]);
    }
  }, [hash, imageQueryParams.filters, imageQueryParams.sort, lastSelectedImage, queryClient, setImageSelection, storeUpdateImageSelection, view]);

  return {
    galleryImageData,
    updateImageSelection,
  };
};
