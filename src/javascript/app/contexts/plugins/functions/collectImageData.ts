import { BW_PALETTE_HEX, Decoder, RGBNDecoder } from 'gb-image-decoder';
import type { RGBNPalette, RGBNTiles } from 'gb-image-decoder';
import type { GetCanvasOptions, PluginImageData } from '../../../../../types/Plugin';
import useItemsStore from '../../../stores/itemsStore';
import useSettingsStore from '../../../stores/settingsStore';
import { getImagePalettes } from '../../../../tools/getImagePalettes';
import { loadImageTiles } from '../../../../tools/loadImageTiles';
import { isRGBNImage } from '../../../../tools/isRGBNImage';
import { loadFrameData } from '../../../../tools/applyFrame/frameData';
import { getDecoderUpdateParams } from '../../../../tools/getDecoderUpdateParams';
import { getRotatedCanvas } from '../../../../tools/applyRotation';
import type { Image, MonochromeImage } from '../../../../../types/Image';
import type { Palette } from '../../../../../types/Palette';

export type CollectImageDataFn = (hash: string) => PluginImageData
export type GetCollectImageDataFn = (images: Image[]) => CollectImageDataFn;

export const getCollectImageData = (images: Image[]) => (hash: string): PluginImageData => {
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
      lockFrame = meta.lockFrame || false,
      invertPalette = (meta as MonochromeImage).invertPalette || false,
      invertFramePalette = (meta as MonochromeImage).invertFramePalette || false,
      handleExportFrame = handleExportFrameState,
    } = options;

    const tiles = await getTiles();
    let decoder: RGBNDecoder | Decoder;

    const frame = frames.find(({ id }) => id === meta.frame);
    const frameData = frame ? await loadFrameData(frame.hash) : null;
    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    if (isRGBN) {
      decoder = new RGBNDecoder();
      decoder.update({
        canvas: null,
        tiles: tiles as RGBNTiles,
        palette: palette as RGBNPalette,
        lockFrame,
      });
    } else {
      decoder = new Decoder();
      const pal = (palette as Palette)?.palette || BW_PALETTE_HEX;
      const framePal = (framePalette as Palette)?.palette || BW_PALETTE_HEX;

      const updateParams = getDecoderUpdateParams({
        palette: pal,
        framePalette: framePal,
        invertPalette,
        invertFramePalette,
      });

      decoder.update({
        canvas: null,
        tiles: tiles as string[],
        ...updateParams,
        imageStartLine,
      });
    }

    const canvas = getRotatedCanvas(decoder.getScaledCanvas(scaleFactor, handleExportFrame), meta.rotation || 0);

    return canvas;
  };

  return {
    getMeta: async () => ({ ...meta, isRGBN }),
    getPalette: async () => (selectedPalette),
    getTiles,
    getCanvas,
  };
};
