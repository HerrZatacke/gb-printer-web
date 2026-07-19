import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import screenfull from 'screenfull';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useTracking } from '@/contexts/TrackingContext';
import { useImages } from '@/hooks/useImages';
import { imageByHashQueryOptions } from '@/stores/queries/images';
import { useInteractionsStore } from '@/stores/stores';
import { nextPowerOfTwo } from '@/tools/nextPowerOfTwo';

interface RenderHashInfo {
  hash: string;
  visible: boolean;
}

interface UseLightboxImage {
  renderHashes: RenderHashInfo[];
  currentIndex: number | null;
  currentTitle: string;
  currentCreated: string;
  isFullscreen: boolean;
  size: number;
  canPrev: boolean;
  canNext: boolean;
  close: () => void;
  prev: () => void;
  next: () => void;
  handleFullscreen: () => void;
}

export const useLightboxImage = (): UseLightboxImage => {
  const { sendEvent } = useTracking();
  const queryClient = useQueryClient();
  const {
    isFullscreen,
    setIsFullscreen,
    setLightboxImage: setLightboxImageState,
    lightboxImage: lightboxImageState,
  } = useInteractionsStore();

  const { view } = useGalleryTreeContext();
  const { hashesByGroupId: lightboxImageHashes  } = useImages({ hashesGroupId: view?.id });

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [currentCreated, setCurrentCreated] = useState<string>('');


  if (currentIndex === null) {

  }

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      if (currentIndex === null) {
        setCurrentTitle('');
        setCurrentCreated('');
        return;
      }

      const image = await queryClient.fetchQuery(imageByHashQueryOptions(lightboxImageHashes[currentIndex]));
      setCurrentTitle(image?.title || '');
      setCurrentCreated(image?.created || '');
    }, 0);

    return () => { window.clearTimeout(handle); };
  }, [currentIndex, lightboxImageHashes, queryClient]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setCurrentIndex((prevInfo) => {
        if (lightboxImageState === null) {
          return null;
        }

        if (typeof prevInfo === null) {
          sendEvent('lightBox', {
            imageCount: nextPowerOfTwo(lightboxImageHashes.length),
          });
        }

        return lightboxImageState;
      });
    });

    return () => window.clearTimeout(handle);
  }, [lightboxImageHashes.length, lightboxImageState, sendEvent]);

  const next = useCallback(() => {
    setCurrentIndex((current) => {
      if (current === null) { return null; }
      const length = lightboxImageHashes.length;

      return Math.min(current + 1, length - 1);
    });
  }, [lightboxImageHashes.length]);

  const prev = useCallback(() => {
    setCurrentIndex((current) => {
      if (current === null) { return null; }

      return Math.max(current - 1, 0);
    });
  }, []);

  const setIndex = useCallback((index: number) => {
    setCurrentIndex((current) => {
      if (current === null) { return null; }

      return index;
    });
  }, []);

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
          setIndex(0);
          ev.preventDefault();
          break;

        case 'End':
          setIndex(lightboxImageHashes.length - 1);
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
      if (screenfull.isEnabled) {
        screenfull.off('change', handleFullscreenChange);
      }
    };
  }, [close, lightboxImageHashes.length, next, prev, setIndex, setIsFullscreen]);


  const handleFullscreen = useCallback(() => {
    if (screenfull.isEnabled) {
      if (!screenfull.element) {
        screenfull.request(document.body);
      } else {
        screenfull.exit();
      }
    }
  }, []);

  const canPrev = useMemo(() => (currentIndex !== null) ? currentIndex > 0 : false, [currentIndex]);
  const canNext = useMemo(() => (currentIndex !== null) ? currentIndex < lightboxImageHashes.length - 1 : false, [currentIndex, lightboxImageHashes.length]);

  const renderHashes = useMemo<RenderHashInfo[]>(() => {
    if (currentIndex === null) {
      return [];
    }

    const visibleHash = lightboxImageHashes[currentIndex];

    return lightboxImageHashes
      .slice(Math.max(0, currentIndex - 1), currentIndex + 2)
      .map((hash): RenderHashInfo => ({
        hash,
        visible: hash === visibleHash,
      }));
  }, [currentIndex, lightboxImageHashes]);

  return {
    currentIndex,
    currentTitle,
    currentCreated,
    renderHashes,
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
