import { useEffect, useMemo } from 'react';
import screenfull from 'screenfull';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import useFiltersStore from '@/stores/filtersStore';
import useInteractionsStore from '@/stores/interactionsStore';
import { getFilteredImages } from '@/tools/getFilteredImages';
import { type Image } from '@/types/Image';

interface UseLightboxImage {
  imageHash: string | null,
  isFullscreen: boolean,
  currentIndex: number,
  size: number,
  canPrev: boolean,
  canNext: boolean,
  close: () => void,
  prev: () => void,
  next: () => void,
  fullscreen: () => void,
}

export const useLightboxImage = (): UseLightboxImage => {
  const filtersState = useFiltersStore();

  const { view, covers } = useGalleryTreeContext();
  const {
    isFullscreen,
    setLightboxImage,
    setLightboxImagePrev,
    setLightboxImageNext,
    setIsFullscreen,
    lightboxImage,
  } = useInteractionsStore();

  const filteredImages = useMemo<Image[]>(() => {
    const viewImages = getFilteredImages(view, filtersState);
    return viewImages.filter(({ hash }) => !covers.includes(hash));
  }, [covers, filtersState, view]);

  const imageHash = useMemo(() => {
    if (lightboxImage === null) { return null; }

    return filteredImages[lightboxImage].hash || null;
  }, [filteredImages, lightboxImage]);

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
        case 'd':
          setLightboxImageNext(filteredImages.length);
          ev.preventDefault();
          break;

        case 'Left':
        case 'ArrowLeft':
        case 'a':
          setLightboxImagePrev();
          ev.preventDefault();
          break;

        case 'Home':
          setLightboxImage(0);
          ev.preventDefault();
          break;

        case 'End':
          setLightboxImage(filteredImages.length - 1);
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
    imageHash,
    isFullscreen,
    currentIndex: lightboxImage || 0,
    size: filteredImages.length,
    canPrev: (lightboxImage !== null) ? lightboxImage > 0 : false,
    canNext: (lightboxImage !== null) ? lightboxImage < filteredImages.length - 1 : false,
    close: () => setLightboxImage(null),
    prev: () => setLightboxImagePrev(),
    next: () => setLightboxImageNext(filteredImages.length),
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
