import screenfull from 'screenfull';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getFilteredImages from '../../../../tools/getFilteredImages';
import { Actions } from '../../../store/actions';
import type { State } from '../../../store/State';
import type { Image } from '../../../../../types/Image';
import type { CloseLightboxAction, LightboxImageSetAction } from '../../../../../types/actions/LightboxActions';
import { useGalleryTreeContext } from '../../../contexts/galleryTree';

interface UseLightboxImage {
  title: string,
  created: string,
  image?: Image,
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

export const useLightboxImage = (): UseLightboxImage => {
  const { view, covers } = useGalleryTreeContext();
  const dispatch = useDispatch();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const {
    viewImages,
    preferredLocale,
    lightboxImage,
  } = useSelector((state: State) => ({
    viewImages: getFilteredImages(state, view.images),
    preferredLocale: state.preferredLocale,
    lightboxImage: state.lightboxImage,
  }));

  const filteredImages = useMemo<Image[]>(() => (
    viewImages.filter(({ hash }) => !covers.includes(hash))
  ), [covers, viewImages]);

  const currentIndex = filteredImages.findIndex(({ hash }) => hash === lightboxImage);
  const image = filteredImages[currentIndex];

  const close = () => {
    if (screenfull.isEnabled && screenfull.element) {
      screenfull.exit();
    }

    dispatch<CloseLightboxAction>({
      type: Actions.CLOSE_LIGHTBOX,
    });
  };

  const prev = () => {
    const nextHash = filteredImages[Math.max(0, currentIndex - 1)].hash;

    if (nextHash) {
      dispatch<LightboxImageSetAction>({
        type: Actions.SET_LIGHTBOX_IMAGE_HASH,
        payload: nextHash,
      });
    }
  };

  const next = () => {
    const nextHash = filteredImages[Math.min(filteredImages.length, currentIndex + 1)].hash;

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
    title: image?.title || '',
    created: image?.created || '',
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
