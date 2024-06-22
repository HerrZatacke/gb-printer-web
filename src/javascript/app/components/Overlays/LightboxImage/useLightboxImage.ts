import { useDispatch, useSelector } from 'react-redux';
import type { RGBNPalette } from 'gb-image-decoder';
import getFilteredImages from '../../../../tools/getFilteredImages';
import { Actions } from '../../../store/actions';
import type { State } from '../../../store/State';
import { isRGBNImage } from '../../../../tools/isRGBNImage';
import type { RGBNHashes, RGBNImage } from '../../../../../types/Image';
import { Rotation } from '../../../../tools/applyRotation';
import { missingGreyPalette } from '../../../defaults';
import type {
  SetLightboxFullscreenAction,
  SetLightboxImageAction,
  SetLightboxNextAction,
  SetLightboxPrevAction,
} from '../../../../../types/actions/GlobalActions';

interface UseLightboxImage {
  hash: string,
  title: string,
  created: string,
  frame: string,
  hashes?: RGBNHashes,
  palette: RGBNPalette | string[],
  isFullscreen: boolean,
  lightboxIndex: number,
  size: number,
  lockFrame: boolean,
  invertPalette: boolean,
  preferredLocale: string,
  rotation: Rotation,
  close: () => void,
  prev: () => void,
  next: () => void,
  fullscreen: () => void,
}

export const useLightboxImage = (): UseLightboxImage => {
  const {
    image,
    size,
    palette,
    isFullscreen,
    lightboxIndex,
    preferredLocale,
  } = useSelector((state: State) => {
    const filteredImages = getFilteredImages(state, state.images);
    const sImage = filteredImages.find((_, lbIndex) => lbIndex === state.lightboxImage);
    let pal: RGBNPalette | string[] | undefined;

    if (sImage) {
      if (isRGBNImage(sImage)) {
        pal = (sImage as RGBNImage).palette;
      } else {
        pal = state.palettes.find(({ shortName }) => shortName === sImage.palette)?.palette;
      }
    }

    return ({
      image: sImage,
      size: filteredImages.length,
      palette: pal || missingGreyPalette.palette,
      isFullscreen: state.isFullscreen,
      lightboxIndex: state.lightboxImage || 0,
      preferredLocale: state.preferredLocale,
    });
  });

  const dispatch = useDispatch();

  return {
    hash: image?.hash || '',
    title: image?.title || '',
    created: image?.created || '',
    hashes: (image as RGBNImage).hashes || null,
    frame: image?.frame || '',
    isFullscreen,
    palette,
    lightboxIndex,
    size,
    lockFrame: image?.lockFrame || false,
    invertPalette: image?.invertPalette || false,
    preferredLocale,
    rotation: image?.rotation || Rotation.DEG_0,
    close: () => {
      dispatch<SetLightboxImageAction>({
        type: Actions.SET_LIGHTBOX_IMAGE_INDEX,
        // No payload means "close"
      });
    },
    prev: () => {
      dispatch<SetLightboxPrevAction>({
        type: Actions.LIGHTBOX_PREV,
      });
    },
    next: () => {
      dispatch<SetLightboxNextAction>({
        type: Actions.LIGHTBOX_NEXT,
      });
    },
    fullscreen: () => {
      dispatch<SetLightboxFullscreenAction>({
        type: Actions.LIGHTBOX_FULLSCREEN,
      });
    },
  };
};
