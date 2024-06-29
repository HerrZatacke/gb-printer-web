import { useDispatch, useSelector } from 'react-redux';
import type { RGBNPalette } from 'gb-image-decoder';
import { missingGreyPalette } from '../../defaults';
import { SpecialTags } from '../../../consts/SpecialTags';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import { isRGBNImage } from '../../../tools/isRGBNImage';
import type { ImageMetadata, MonochromeImage, RGBNHashes, RGBNImage } from '../../../../types/Image';
import type { Rotation } from '../../../tools/applyRotation';
import type { EditImageSelectionAction } from '../../../../types/actions/ImageActions';
import type {
  ImageSelectionAddAction,
  ImageSelectionRemoveAction,
  ImageSelectionShiftClickAction,
} from '../../../../types/actions/ImageSelectionActions';
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
  lockFrame?: boolean,
  invertPalette?: boolean,
  hideDate: boolean,
  preferredLocale: string,
  meta?: ImageMetadata,
  rotation?: Rotation,
  enableDebug: boolean,
}

interface UseGalleryImage {
  galleryImageData?: GalleryImageData
  updateImageSelection: (mode: SelectionEditMode, shift: boolean, page: number) => void,
  editImage: (tags: string[]) => void,
}

export const useGalleryImage = (hash: string): UseGalleryImage => {
  const galleryImageData = useSelector((state: State): GalleryImageData | undefined => {
    const image = state.images.find((img) => img.hash === hash);
    let palette: RGBNPalette | string[];

    if (!image) {
      return undefined;
    }

    if (isRGBNImage(image)) {
      palette = (image as RGBNImage).palette;
    } else {
      palette = (state.palettes.find(({ shortName }) => (
        shortName === (image as MonochromeImage).palette
      )) || missingGreyPalette).palette;
    }

    return ({
      title: image.title,
      created: image.created,
      frame: image.frame,
      hashes: (image as RGBNImage).hashes || undefined,
      tags: image.tags,
      isFavourite: image.tags.includes(SpecialTags.FILTER_FAVOURITE),
      isSelected: state.imageSelection.includes(hash),
      palette,
      lockFrame: image.lockFrame,
      invertPalette: image.invertPalette,
      hideDate: state.hideDates,
      preferredLocale: state.preferredLocale,
      meta: image.meta,
      rotation: image.rotation,
      enableDebug: state.enableDebug,
    });
  });

  const { images } = useGalleryTreeContext();

  const dispatch = useDispatch();

  return {
    galleryImageData,
    updateImageSelection: (mode: SelectionEditMode, shift: boolean, page: number) => {
      if (shift) {
        dispatch<ImageSelectionShiftClickAction>({
          type: Actions.IMAGE_SELECTION_SHIFTCLICK,
          payload: { hash, images, page },
        });
      } else if (mode === SelectionEditMode.ADD) {
        dispatch<ImageSelectionAddAction>({
          type: Actions.IMAGE_SELECTION_ADD,
          payload: hash,
        });
      } else if (mode === SelectionEditMode.REMOVE) {
        dispatch<ImageSelectionRemoveAction>({
          type: Actions.IMAGE_SELECTION_REMOVE,
          payload: hash,
        });
      }
    },
    editImage: (tags: string[]) => {
      dispatch<EditImageSelectionAction>({
        type: Actions.EDIT_IMAGE_SELECTION,
        payload: {
          tags,
          batch: [hash],
        },
      });
    },
  };
};
