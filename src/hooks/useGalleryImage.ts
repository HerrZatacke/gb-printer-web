import { type RGBNPalette, type Rotation } from 'gb-image-decoder';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { missingGreyPalette } from '@/consts/defaults';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import {
  type ImageSelectionMode,
  useFiltersStore,
  useItemsStore,
  useSettingsStore,
} from '@/stores/stores';
import { getFilteredImages } from '@/tools/getFilteredImages';
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
  updateImageSelection: (mode: ImageSelectionMode, shift: boolean, page: number) => void;
}

export const useGalleryImage = (hash: string): UseGalleryImage => {
  const { pageSize } = useSettingsStore();

  const {
    filtersTags,
    filtersFrames,
    filtersPalettes,
    sortBy,
    recentImports,
    imageSelection,
    updateImageSelection: storeUpdateImageSelection,
    lastSelectedImage,
    setImageSelection,
  } = useFiltersStore();

  const { images: stateImages } = useItemsStore();
  const stateImage = stateImages.find((img) => img.hash === hash);

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

  const { view, covers } = useGalleryTreeContext();

  const updateImageSelection = useCallback((mode: ImageSelectionMode, shift: boolean, page: number) => {
    if (shift) {
      const images = getFilteredImages(
        view,
        {
          filtersTags,
          filtersFrames,
          filtersPalettes,
          sortBy,
          recentImports,
        },
      )
        .filter((image) => (
          !covers.includes(image.hash)
        ));

      const selectedIndex = images.findIndex((image) => image.hash === hash);
      let prevSelectedIndex = images.findIndex((image) => image.hash === lastSelectedImage);
      if (prevSelectedIndex === -1) {
        prevSelectedIndex = page * pageSize;
      }

      const from = Math.min(prevSelectedIndex, selectedIndex);
      const to = Math.max(prevSelectedIndex, selectedIndex);

      setImageSelection(images.slice(from, to + 1).map((image) => image.hash));
    } else {
      storeUpdateImageSelection(mode, [hash]);
    }
  }, [covers, filtersFrames, filtersPalettes, filtersTags, hash, lastSelectedImage, pageSize, recentImports, setImageSelection, sortBy, storeUpdateImageSelection, view]);

  return {
    galleryImageData,
    updateImageSelection,
  };
};
