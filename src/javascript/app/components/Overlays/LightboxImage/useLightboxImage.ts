import { useDispatch, useSelector } from 'react-redux';
import { RGBNPalette } from 'gb-image-decoder';
import getRGBNFrames from '../../../../tools/getRGBNFrames';
import getFilteredImages from '../../../../tools/getFilteredImages';
import { Actions } from '../../../store/actions';
import { State } from '../../../store/State';
import { isRGBNImage } from '../../../../tools/isRGBNImage';
import { RGBNHashes, RGBNImage } from '../../../../../types/Image';
import { Rotation } from '../../../../tools/applyRotation';
import { missingGreyPalette } from '../../../defaults';

interface UseLightboxImage {
  hash: string,
  title: string,
  created: string,
  frame: string,
  hashes?: RGBNHashes,
  frames?: RGBNHashes,
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
    frames,
    isFullscreen,
    lightboxIndex,
    preferredLocale,
  } = useSelector((state: State) => {
    const filteredImages = getFilteredImages(state);
    const sImage = filteredImages.find((_, lbIndex) => lbIndex === state.lightboxImage);
    let pal: RGBNPalette | string[] | undefined;
    let rgbnFrames: RGBNHashes | undefined;

    if (sImage) {
      if (isRGBNImage(sImage)) {
        pal = (sImage as RGBNImage).palette;
        rgbnFrames = getRGBNFrames(state, (sImage as RGBNImage).hashes, sImage.frame || undefined);
      } else {
        pal = state.palettes.find(({ shortName }) => shortName === sImage.palette)?.palette;
      }
    }

    return ({
      image: sImage,
      size: filteredImages.length,
      palette: pal || missingGreyPalette.palette,
      frames: rgbnFrames,
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
    frames,
    lightboxIndex,
    size,
    lockFrame: image?.lockFrame || false,
    invertPalette: image?.invertPalette || false,
    preferredLocale,
    rotation: image?.rotation || Rotation.DEG_0,
    close: () => {
      dispatch({
        type: Actions.SET_LIGHTBOX_IMAGE_INDEX,
        payload: null,
      });
    },
    prev: () => {
      dispatch({
        type: Actions.LIGHTBOX_PREV,
      });
    },
    next: () => {
      dispatch({
        type: Actions.LIGHTBOX_NEXT,
      });
    },
    fullscreen: () => {
      dispatch({
        type: Actions.LIGHTBOX_FULLSCREEN,
      });
    },
  };
};
