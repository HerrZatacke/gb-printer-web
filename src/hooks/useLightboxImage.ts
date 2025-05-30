import type { RGBNPalette, Rotation } from 'gb-image-decoder';
import { useEffect, useMemo } from 'react';
import screenfull from 'screenfull';
import { missingGreyPalette } from '@/consts/defaults';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import useFiltersStore from '@/stores/filtersStore';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import { getFilteredImages } from '@/tools/getFilteredImages';
import { getImagePalettes } from '@/tools/getImagePalettes';
import { getPaletteSettings } from '@/tools/getPaletteSettings';
import { isRGBNImage } from '@/tools/isRGBNImage';
import type { Image, MonochromeImage, RGBNHashes, RGBNImage } from '@/types/Image';
import type { Palette } from '@/types/Palette';

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
  let framePalette: string[] = [];

  if (!image?.hash) {
    return null;
  }

  const {
    palette: selectedPalette,
    framePalette: selectedFramePalette,
  } = getImagePalettes(palettes, image);

  if (!selectedPalette) {
    throw new Error('Palette missing?');
  }

  const { invertPalette, invertFramePalette } = getPaletteSettings(image as MonochromeImage);

  if (isRGBNImage(image)) {
    palette = selectedPalette as RGBNPalette;
  } else {
    palette = ((selectedPalette || missingGreyPalette) as Palette).palette;
    framePalette = (selectedFramePalette || missingGreyPalette).palette;
  }

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
    invertPalette,
    invertFramePalette,
    rotation: image.rotation,
  });
};

export const useLightboxImage = (): UseLightboxImage => {
  const filtersState = useFiltersStore();

  const { view, covers } = useGalleryTreeContext();
  // ToDo: zustand or useState??
  const {
    isFullscreen,
    setLightboxImage,
    setLightboxImagePrev,
    setLightboxImageNext,
    setIsFullscreen,
    lightboxImage,
  } = useInteractionsStore();
  // const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const { preferredLocale } = useSettingsStore();
  const { palettes } = useItemsStore();
  const viewImages = getFilteredImages(view.images, filtersState);

  const filteredImages = useMemo<Image[]>(() => (
    viewImages.filter(({ hash }) => !covers.includes(hash))
  ), [covers, viewImages]);

  const image = (lightboxImage !== null) ? toLightBoxImage(filteredImages[lightboxImage], palettes) : null;

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
    image,
    isFullscreen,
    currentIndex: lightboxImage || 0,
    size: filteredImages.length,
    canPrev: (lightboxImage !== null) ? lightboxImage > 0 : false,
    canNext: (lightboxImage !== null) ? lightboxImage < filteredImages.length - 1 : false,
    preferredLocale,
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
