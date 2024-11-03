import { useSelector } from 'react-redux';
import screenfull from 'screenfull';
import type { RGBNPalette } from 'gb-image-decoder';
import { getFilteredImages } from '../../../../tools/getFilteredImages';
import useFiltersStore from '../../../stores/filtersStore';
import useSettingsStore from '../../../stores/settingsStore';
import useInteractionsStore from '../../../stores/interactionsStore';
import type { State } from '../../../store/State';
import { isRGBNImage } from '../../../../tools/isRGBNImage';
import type { MonochromeImage, RGBNHashes, RGBNImage } from '../../../../../types/Image';
import { Rotation } from '../../../../tools/applyRotation';
import { missingGreyPalette } from '../../../defaults';

interface UseLightboxImage {
  hash: string,
  title: string,
  created: string,
  frame: string,
  hashes?: RGBNHashes,
  palette: RGBNPalette | string[],
  invertFramePalette: boolean,
  framePalette: string[],
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
  const filtersState = useFiltersStore();
  const {
    isFullscreen,
    setLightboxImage,
    setLightboxImagePrev,
    setLightboxImageNext,
    lightboxImage,
  } = useInteractionsStore();

  const {
    imageCount,
    image,
    size,
    palette,
    framePalette,
    lightboxIndex,
  } = useSelector((state: State) => {
    const filteredImages = getFilteredImages(state.images, filtersState);
    const sImage = filteredImages.find((_, lbIndex) => lbIndex === lightboxImage);
    let pal: RGBNPalette | string[] | undefined;
    let fPal: string[] | undefined;

    if (sImage) {
      if (isRGBNImage(sImage)) {
        pal = (sImage as RGBNImage).palette;
      } else {
        pal = state.palettes.find(({ shortName }) => shortName === sImage.palette)?.palette;
        fPal = state.palettes.find(({ shortName }) => shortName === (sImage as MonochromeImage).framePalette)?.palette;
      }
    }

    return {
      imageCount: state.images.length,
      image: sImage,
      size: filteredImages.length,
      palette: pal || missingGreyPalette.palette,
      framePalette: fPal || missingGreyPalette.palette,
      lightboxIndex: lightboxImage || 0,
    };
  });

  const { preferredLocale } = useSettingsStore();

  return {
    hash: image?.hash || '',
    title: image?.title || '',
    created: image?.created || '',
    hashes: (image as RGBNImage)?.hashes || null,
    frame: image?.frame || '',
    isFullscreen,
    palette,
    framePalette,
    lightboxIndex,
    size,
    lockFrame: image?.lockFrame || false,
    invertPalette: (image as MonochromeImage)?.invertPalette || false,
    invertFramePalette: (image as MonochromeImage)?.invertFramePalette || false,
    preferredLocale,
    rotation: image?.rotation || Rotation.DEG_0,
    close: () => setLightboxImage(null),
    prev: () => setLightboxImagePrev(),
    next: () => setLightboxImageNext(imageCount),
    fullscreen: () => {
      if (screenfull.isEnabled) {
        if (!screenfull.element) {
          screenfull.request(document.body);
        } else {
          screenfull.exit();
        }
      }
    },
  };
};
