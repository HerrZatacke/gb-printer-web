import { useCallback, useEffect, useMemo, useState } from 'react';
import screenfull from 'screenfull';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import useFiltersStore from '@/stores/filtersStore';
import useInteractionsStore from '@/stores/interactionsStore';
import { getFilteredImages } from '@/tools/getFilteredImages';
import { type Image } from '@/types/Image';

interface CurrentInfo {
  index: number,
  title: string,
  created: string,
}

interface UseLightboxImage {
  renderHash: string,
  currentInfo: CurrentInfo | null,
  isFullscreen: boolean,
  size: number,
  canPrev: boolean,
  canNext: boolean,
  close: () => void,
  prev: () => void,
  next: () => void,
  handleFullscreen: () => void,
}

export const useLightboxImage = (): UseLightboxImage => {
  const filtersState = useFiltersStore();

  const { view, covers } = useGalleryTreeContext();
  const {
    isFullscreen,
    setIsFullscreen,
    setLightboxImage: setLightboxImageState,
    lightboxImage: lightboxImageState,
  } = useInteractionsStore();

  const filteredImages = useMemo<Image[]>(() => {
    console.log('filteredImagesUpdate');
    const viewImages = getFilteredImages(view, filtersState);
    return viewImages.filter(({ hash }) => !covers.includes(hash));
  }, [covers, filtersState, view]);

  const lightboxImageHashes = useMemo<string[]>(() => (
    filteredImages.map(({ hash }) => (hash))
  ), [filteredImages]);


  const [currentInfo, setCurrentInfo] = useState<CurrentInfo | null>(null);

  const createCurrentInfo = useCallback((index: number): CurrentInfo | null => {
    const currentImage = filteredImages[index];
    if (!currentImage) { return null; }

    return {
      title: currentImage.title,
      created: currentImage.created,
      index,
    };
  }, [filteredImages]);

  useEffect(() => {
    console.log('Initially setting currentInfo', Date.now());
    if (lightboxImageState === null) {
      setCurrentInfo(null);
    } else {
      setCurrentInfo(createCurrentInfo(lightboxImageState));
    }
  }, [createCurrentInfo, lightboxImageState]);

  const next = useCallback(() => {
    setCurrentInfo((current) => {
      if (current === null) { return null; }
      const { length } = filteredImages;

      return createCurrentInfo(Math.min(current.index + 1, length - 1));
    });
  }, [createCurrentInfo, filteredImages]);

  const prev = useCallback(() => {
    setCurrentInfo((current) => {
      if (current === null) { return null; }

      return createCurrentInfo(Math.max(current.index - 1, 0));
    });
  }, [createCurrentInfo]);

  const setCurrentIndex = useCallback((index: number) => {
    setCurrentInfo((current) => {
      if (current === null) { return null; }

      return createCurrentInfo(index);
    });
  }, [createCurrentInfo]);

  const close = useCallback(() => {
    setLightboxImageState(null);
  }, [setLightboxImageState]);

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
          next();
          ev.preventDefault();
          break;

        case 'Left':
        case 'ArrowLeft':
        case 'a':
          prev();
          ev.preventDefault();
          break;

        case 'Home':
          setCurrentIndex(0);
          ev.preventDefault();
          break;

        case 'End':
          setCurrentIndex(filteredImages.length - 1);
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
  }, [filteredImages.length, setIsFullscreen, next, prev, close, createCurrentInfo, setCurrentIndex]);

  const handleFullscreen = useCallback(() => {
    if (screenfull.isEnabled) {
      if (!screenfull.element) {
        screenfull.request(document.body);
      } else {
        screenfull.exit();
      }
    }
  }, []);

  const canPrev = useMemo(() => (currentInfo !== null) ? currentInfo.index > 0 : false, [currentInfo]);
  const canNext = useMemo(() => (currentInfo !== null) ? currentInfo.index < filteredImages.length - 1 : false, [currentInfo, filteredImages.length]);

  const renderHash = useMemo(() => {
    if (!currentInfo) {
      return '';
    }

    return lightboxImageHashes[currentInfo.index];
  }, [lightboxImageHashes, currentInfo]);

  return {
    currentInfo,
    renderHash,
    isFullscreen,
    size: lightboxImageHashes.length,
    canPrev,
    canNext,
    close,
    prev,
    next,
    handleFullscreen,
  };
};
