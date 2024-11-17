import { useSelector } from 'react-redux';
import type { RGBNPalette } from 'gb-image-decoder';
import useEditStore from '../../stores/editStore';
import useFiltersStore from '../../stores/filtersStore';
import useItemsStore from '../../stores/itemsStore';
import useSettingsStore from '../../stores/settingsStore';
import type { ImageSelectionMode } from '../../stores/filtersStore';
import { getFilteredImages } from '../../../tools/getFilteredImages';
import { missingGreyPalette } from '../../defaults';
import { SpecialTags } from '../../../consts/SpecialTags';
import type { State } from '../../store/State';
import { isRGBNImage } from '../../../tools/isRGBNImage';
import type { ImageMetadata, MonochromeImage, RGBNHashes, RGBNImage } from '../../../../types/Image';
import type { Rotation } from '../../../tools/applyRotation';
import { useGalleryTreeContext } from '../../contexts/galleryTree';

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
  isFavourite: boolean,
  isSelected: boolean,
  palette: RGBNPalette | string[],
  framePalette: string[],
  lockFrame?: boolean,
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  hideDate: boolean,
  preferredLocale: string,
  meta?: ImageMetadata,
  rotation?: Rotation,
  enableDebug: boolean,
}

interface UseGalleryImage {
  galleryImageData?: GalleryImageData
  updateImageSelection: (mode: ImageSelectionMode, shift: boolean, page: number) => void,
  editImage: (tags: string[]) => void,
}

export const useGalleryImage = (hash: string): UseGalleryImage => {
  const { setEditImages } = useEditStore();

  const {
    enableDebug,
    hideDates,
    preferredLocale,
    pageSize,
  } = useSettingsStore();

  const {
    filtersActiveTags,
    sortBy,
    recentImports,
    imageSelection,
    updateImageSelection,
    lastSelectedImage,
    setImageSelection,
  } = useFiltersStore();

  const { palettes } = useItemsStore();

  const isSelected = imageSelection.includes(hash);

  const galleryImageData = useSelector((state: State): GalleryImageData | undefined => {
    const image = state.images.find((img) => img.hash === hash);
    let palette: RGBNPalette | string[];

    if (!image) {
      return undefined;
    }

    if (isRGBNImage(image)) {
      palette = (image as RGBNImage).palette;
    } else {
      palette = (palettes.find(({ shortName }) => (
        shortName === (image as MonochromeImage).palette
      )) || missingGreyPalette).palette;
    }

    const framePalette = (palettes.find(({ shortName }) => (
      shortName === (image as MonochromeImage).framePalette
    )) || missingGreyPalette).palette;

    return ({
      title: image.title,
      created: image.created,
      frame: image.frame,
      hashes: (image as RGBNImage).hashes || undefined,
      tags: image.tags,
      isFavourite: image.tags.includes(SpecialTags.FILTER_FAVOURITE),
      palette,
      framePalette,
      lockFrame: image.lockFrame,
      invertPalette: (image as MonochromeImage).invertPalette,
      invertFramePalette: (image as MonochromeImage).invertFramePalette,
      hideDate: hideDates,
      meta: image.meta,
      rotation: image.rotation,
      preferredLocale,
      enableDebug,
      isSelected,
    });
  });

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
        updateImageSelection(mode, hash);
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
