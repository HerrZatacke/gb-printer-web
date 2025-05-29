import { BW_PALETTE_HEX, getMonochromeImageBlob, getRGBNImageBlob } from 'gb-image-decoder';
import type { RGBNPalette, RGBNTiles } from 'gb-image-decoder';
import type { GetCanvasOptions, GetCollectImageDataFn, PluginImageData } from '../../../../../types/Plugin';
import useItemsStore from '../../../stores/itemsStore';
import useSettingsStore from '../../../stores/settingsStore';
import { getImagePalettes } from '../../../../tools/getImagePalettes';
import { loadImageTiles } from '../../../../tools/loadImageTiles';
import { isRGBNImage } from '../../../../tools/isRGBNImage';
import { loadFrameData } from '../../../../tools/applyFrame/frameData';
import { getMonochromeImageCreationParams } from '../../../../tools/getMonochromeImageCreationParams';
import type { Image, MonochromeImage } from '../../../../../types/Image';
import type { Palette } from '../../../../../types/Palette';
import { getPaletteSettings } from '../../../../tools/getPaletteSettings';

export const getCollectImageData: GetCollectImageDataFn = (images: Image[]) => (hash: string): PluginImageData => {
  const { frames, palettes } = useItemsStore.getState();
  const { handleExportFrame: handleExportFrameState } = useSettingsStore.getState();

  const meta = images.find((image) => image.hash === hash);
  if (!meta) {
    throw new Error('image not found');
  }

  const { palette: selectedPalette, framePalette: selectedFramePalette } = getImagePalettes(palettes, meta);
  if (!selectedPalette) {
    throw new Error('selectedPalette not found');
  }

  const getTiles = () => loadImageTiles(images, frames)(meta.hash);

  const isRGBN = isRGBNImage(meta);

  const getCanvas = async (options: GetCanvasOptions = {}): Promise<HTMLCanvasElement> => {
    const {
      scaleFactor = 1,
      palette = selectedPalette,
      framePalette = selectedFramePalette,
      lockFrame,
      invertPalette,
      invertFramePalette,
      handleExportFrame = handleExportFrameState,
    } = options;

    const tiles = await getTiles();
    let blob: Blob;

    const frame = frames.find(({ id }) => id === meta.frame);
    const frameData = frame ? await loadFrameData(frame.hash) : null;
    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    if (isRGBN) {
      blob = await getRGBNImageBlob({
        tiles: tiles as RGBNTiles,
        palette: palette as RGBNPalette,
        lockFrame: typeof lockFrame !== 'undefined' ? lockFrame : meta.lockFrame,
        imageStartLine,
        rotation: meta.rotation,
        scaleFactor,
        handleExportFrame,
      }, 'image/png');
    } else {
      const pal = (palette as Palette)?.palette || BW_PALETTE_HEX;
      const framePal = (framePalette as Palette)?.palette || BW_PALETTE_HEX;

      const {
        invertPalette: selectedInvertPalette,
        invertFramePalette: selectedInvertFramePalette,
      } = getPaletteSettings(meta as MonochromeImage);

      const updateParams = getMonochromeImageCreationParams({
        imagePalette: pal,
        framePalette: framePal,
        invertPalette: typeof invertPalette !== 'undefined' ? invertPalette : selectedInvertPalette,
        invertFramePalette: typeof invertFramePalette !== 'undefined' ? invertFramePalette : selectedInvertFramePalette,
      });

      blob = await getMonochromeImageBlob({
        tiles: tiles as string[],
        imageStartLine,
        rotation: meta.rotation,
        scaleFactor,
        handleExportFrame,
        ...updateParams,
      }, 'image/png');
    }

    const imageBitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(imageBitmap, 0, 0);

    return canvas;
  };

  return {
    getMeta: async () => ({ ...meta, isRGBN }),
    getPalette: async () => (selectedPalette),
    getTiles,
    getCanvas,
  };
};
