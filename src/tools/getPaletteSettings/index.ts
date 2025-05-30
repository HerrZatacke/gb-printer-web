import type { MonochromeImage } from '@/types/Image';

export interface PaletteSettings {
  invertPalette: boolean,
  invertFramePalette: boolean,
}

export const getPaletteSettings = (image: MonochromeImage): PaletteSettings => {
  const invertPalette = image.invertPalette || false;

  if (!image.lockFrame) {
    return {
      invertPalette,
      invertFramePalette: invertPalette,
    };
  }

  const unsafeInvertFramePalette: boolean | undefined = image.invertFramePalette;
  const invertFramePalette = typeof unsafeInvertFramePalette === 'undefined' ? invertPalette : unsafeInvertFramePalette;


  return {
    invertPalette,
    invertFramePalette,
  };
};
