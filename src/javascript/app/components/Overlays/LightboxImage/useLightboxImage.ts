import screenfull from 'screenfull';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RGBNPalette } from 'gb-image-decoder';
import { getFilteredImages } from '../../../../tools/getFilteredImages';
import useFiltersStore from '../../../stores/filtersStore';
import useSettingsStore from '../../../stores/settingsStore';
import { Actions } from '../../../store/actions';
import type { State } from '../../../store/State';
import type { Image, MonochromeImage, RGBNHashes, RGBNImage } from '../../../../../types/Image';
import type { CloseLightboxAction, LightboxImageSetAction } from '../../../../../types/actions/LightboxActions';
import type { Rotation } from '../../../../tools/applyRotation';
import type { Palette } from '../../../../../types/Palette';
import { useGalleryTreeContext } from '../../../contexts/galleryTree';
import { isRGBNImage } from '../../../../tools/isRGBNImage';
import { missingGreyPalette } from '../../../defaults';

interface LightboxImageData {
  title: string,
  created: string,
  frame?: string,
  hash: string,
  hashes?: RGBNHashes,
  tags: string[],
  palette: RGBNPalette | string[],
  framePalette: string[],
  lockFrame?: boolean,
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  rotation?: Rotation,
}

interface UseLightboxImage {
  image: LightboxImageData | null,
  isFullscreen: boolean,
  currentIndex: number,
  size: number,
  canPrev: boolean,
  canNext: boolean,
  preferredLocale: string,
  close: () => void,
  prev: () => void,
  next: () => void,
  fullscreen: () => void,
}

const toLightBoxImage = (image: Image, palettes: Palette[]): LightboxImageData | null => {
  let palette: RGBNPalette | string[];

  if (!image?.hash) {
    return null;
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
    title: image?.title || '',
    created: image?.created || '',
    frame: image.frame,
    hash: image.hash,
    hashes: (image as RGBNImage).hashes || undefined,
    tags: image.tags,
    palette,
    framePalette,
    lockFrame: image.lockFrame,
    invertPalette: (image as MonochromeImage).invertPalette,
    invertFramePalette: (image as MonochromeImage).invertFramePalette,
    rotation: image.rotation,
  });
};

export const useLightboxImage = (): UseLightboxImage => {
  const filtersState = useFiltersStore();

  const { view, covers } = useGalleryTreeContext();
  const dispatch = useDispatch();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const { preferredLocale } = useSettingsStore();

  const {
    viewImages,
    lightboxImage,
    palettes,
  } = useSelector((state: State) => ({
    viewImages: getFilteredImages(view.images, filtersState),
    lightboxImage: state.lightboxImage,
    palettes: state.palettes,
  }));

  const filteredImages = useMemo<Image[]>(() => (
    viewImages.filter(({ hash }) => !covers.includes(hash))
  ), [covers, viewImages]);

  const currentIndex = filteredImages.findIndex(({ hash }) => hash === lightboxImage);
  const image = toLightBoxImage(filteredImages[currentIndex], palettes);

  const close = () => {
    if (screenfull.isEnabled && screenfull.element) {
      screenfull.exit();
    }

    dispatch<CloseLightboxAction>({
      type: Actions.CLOSE_LIGHTBOX,
    });
  };

  const prev = () => {
    const nextHash = filteredImages[Math.max(0, currentIndex - 1)]?.hash;

    if (nextHash) {
      dispatch<LightboxImageSetAction>({
        type: Actions.SET_LIGHTBOX_IMAGE_HASH,
        payload: nextHash,
      });
    }
  };

  const next = () => {
    const nextHash = filteredImages[Math.min(filteredImages.length, currentIndex + 1)]?.hash;

    if (nextHash) {
      dispatch<LightboxImageSetAction>({
        type: Actions.SET_LIGHTBOX_IMAGE_HASH,
        payload: nextHash,
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!screenfull.element);
    };

    const keyboardHandler = (ev: KeyboardEvent) => {
      switch (ev.key) {
        case 'Esc':
        case 'Escape':
          close();
          ev.preventDefault();
          break;

        case 'Right':
        case 'ArrowRight':
          next();
          ev.preventDefault();
          break;

        case 'Left':
        case 'ArrowLeft':
          prev();
          ev.preventDefault();
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', keyboardHandler);
    if (screenfull.isEnabled) {
      screenfull.on('change', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('keydown', keyboardHandler);
      screenfull.off('change', handleFullscreenChange);
    };
  });

  return {
    image,
    isFullscreen,
    currentIndex,
    size: filteredImages.length,
    canPrev: currentIndex > 0,
    canNext: currentIndex < filteredImages.length - 1,
    preferredLocale,
    prev,
    next,
    close,
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
