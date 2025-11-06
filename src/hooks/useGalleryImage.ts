import type { RGBNPalette, Rotation } from 'gb-image-decoder';
import { useCallback, useMemo } from 'react';
import { missingGreyPalette } from '@/consts/defaults';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import useFiltersStore from '@/stores/filtersStore';
import type { ImageSelectionMode } from '@/stores/filtersStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import { getFilteredImages } from '@/tools/getFilteredImages';
import { getImagePalettes } from '@/tools/getImagePalettes';
import { getPaletteSettings } from '@/tools/getPaletteSettings';
import { isRGBNImage } from '@/tools/isRGBNImage';
import type { MonochromeImage, RGBNHashes, RGBNImage } from '@/types/Image';
import type { Palette } from '@/types/Palette';

export enum SelectionEditMode {
  ADD = 'add',
  REMOVE = 'remove',
}

interface GalleryImageData {
  title: string,
  created: string,
  frame?: string,
  hashes?: RGBNHashes,
  tags: string[],
  selectionIndex: number,
  palette: RGBNPalette | string[],
  framePalette: string[],
  lockFrame?: boolean,
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  rotation?: Rotation,
}

interface UseGalleryImage {
  galleryImageData: GalleryImageData | null,
  updateImageSelection: (mode: ImageSelectionMode, shift: boolean, page: number) => void,
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

  const { palettes, images: stateImages } = useItemsStore();

  const selectionIndex = imageSelection.indexOf(hash);

  const galleryImageData = useMemo((): GalleryImageData | null => {
    const image = stateImages.find((img) => img.hash === hash);
    let palette: RGBNPalette | string[];
    let framePalette: string[] = [];

    if (!image) {
      return null;
    }

    const {
      palette: selectedPalette,
      framePalette: selectedFramePalette,
    } = getImagePalettes(palettes, image);

    const { invertPalette, invertFramePalette } = getPaletteSettings(image as MonochromeImage);

    if (!selectedPalette) {
      throw new Error('Palette missing?');
    }

    if (isRGBNImage(image)) {
      palette = selectedPalette as RGBNPalette;
    } else {
      palette = ((selectedPalette || missingGreyPalette) as Palette).palette;
      framePalette = (selectedFramePalette || missingGreyPalette).palette;
    }


    return ({
      title: image.title,
      created: image.created,
      frame: image.frame,
      hashes: (image as RGBNImage).hashes || undefined,
      tags: image.tags,
      palette,
      framePalette,
      lockFrame: image.lockFrame,
      invertPalette,
      invertFramePalette,
      rotation: image.rotation,
      selectionIndex,
    });
  }, [hash, selectionIndex, palettes, stateImages]);

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
