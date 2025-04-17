import { useMemo } from 'react';
import type { RGBNPalette } from 'gb-image-decoder';
import useEditStore from '../../stores/editStore';
import useFiltersStore from '../../stores/filtersStore';
import useItemsStore from '../../stores/itemsStore';
import useSettingsStore from '../../stores/settingsStore';
import { getFilteredImages } from '../../../tools/getFilteredImages';
import { missingGreyPalette } from '../../defaults';
import { isRGBNImage } from '../../../tools/isRGBNImage';
import { getImagePalettes } from '../../../tools/getImagePalettes';
import { getPaletteSettings } from '../../../tools/getPaletteSettings';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import type { ImageSelectionMode } from '../../stores/filtersStore';
import type { MonochromeImage, RGBNHashes, RGBNImage } from '../../../../types/Image';
import type { Rotation } from '../../../tools/applyRotation';
import type { Palette } from '../../../../types/Palette';

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
  galleryImageData?: GalleryImageData
  updateImageSelection: (mode: ImageSelectionMode, shift: boolean, page: number) => void,
  editImage: (tags: string[]) => void,
}

export const useGalleryImage = (hash: string): UseGalleryImage => {
  const { setEditImages } = useEditStore();

  const { pageSize } = useSettingsStore();

  const {
    filtersActiveTags,
    sortBy,
    recentImports,
    imageSelection,
    updateImageSelection,
    lastSelectedImage,
    setImageSelection,
  } = useFiltersStore();

  const { palettes, images: stateImages } = useItemsStore();

  const selectionIndex = imageSelection.indexOf(hash);

  const galleryImageData = useMemo((): GalleryImageData | undefined => {
    const image = stateImages.find((img) => img.hash === hash);
    let palette: RGBNPalette | string[];
    let framePalette: string[] = [];

    if (!image) {
      return undefined;
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

  const { images: treeImages } = useGalleryTreeContext();

  return {
    galleryImageData,
    updateImageSelection: (mode: ImageSelectionMode, shift: boolean, page: number) => {
      if (shift) {
        const images = getFilteredImages(
          treeImages,
          { filtersActiveTags, sortBy, recentImports },
        );
        const selectedIndex = images.findIndex((image) => image.hash === hash);
        let prevSelectedIndex = images.findIndex((image) => image.hash === lastSelectedImage);
        if (prevSelectedIndex === -1) {
          prevSelectedIndex = page * pageSize;
        }

        const from = Math.min(prevSelectedIndex, selectedIndex);
        const to = Math.max(prevSelectedIndex, selectedIndex);

        setImageSelection(images.slice(from, to + 1).map((image) => image.hash));
      } else {
        updateImageSelection(mode, [hash]);
      }
    },
    editImage: (tags: string[]) => {
      setEditImages({
        tags,
        batch: [hash],
      });
    },
  };
};
