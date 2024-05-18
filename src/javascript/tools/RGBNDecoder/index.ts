import { RGBNPalette } from '../../../types/Image';
import { BlendMode, blendModeNewName } from './blendModes';
import Decoder from '../Decoder';
import { Channel, ChannelKey, Channels, RGBNTiles, SourceCanvases } from './types';
import { ExportFrameMode } from '../../consts/exportFrameModes';
import { TILE_PIXEL_HEIGHT, TILES_PER_LINE } from '../Decoder/constants';

const hx2 = (n?: number) => (n || 0).toString(16).padStart(2, '0');

const paletteFunctions: Record<ChannelKey, ((n: number) => string)> = {
  r: (v?: number) => `#${hx2(v)}0000`,
  g: (v?: number) => `#00${hx2(v)}00`,
  b: (v?: number) => `#0000${hx2(v)}`,
  n: (v?: number) => `#${hx2(v)}${hx2(v)}${hx2(v)}`,
};

const defaultPalette: RGBNPalette = {
  r: [0, 84, 172, 255],
  g: [0, 84, 172, 255],
  b: [0, 84, 172, 255],
  n: [0, 85, 170, 255],
  blend: BlendMode.MULTIPLY,
};

const channels = [ChannelKey.R, ChannelKey.G, ChannelKey.B, ChannelKey.N];

const createChannel = (key: ChannelKey): Channel => {
  const canvas = document.createElement('canvas');
  const decoder = new Decoder();

  decoder.update({
    canvas,
    tiles: [],
    palette: [],
    lockFrame: false,
    invertPalette: false,
  });

  return {
    key,
    decoder,
    canvas,
  };
};

class RGBNDecoder {
  private canvas: HTMLCanvasElement | null;
  private palette: RGBNPalette;
  private lockFrame: boolean;
  private channels: Channels;

  constructor() {
    this.canvas = null;
    this.palette = defaultPalette;
    this.lockFrame = false;

    this.channels = {
      r: createChannel(ChannelKey.R),
      g: createChannel(ChannelKey.G),
      b: createChannel(ChannelKey.B),
      n: createChannel(ChannelKey.N),
    };
  }

  public update({
    canvas = null,
    tiles = {},
    palette,
    lockFrame = false,
  }: {
    canvas: HTMLCanvasElement | null,
    tiles: RGBNTiles,
    palette: RGBNPalette
    lockFrame: boolean,
  }) {
    const canvasChanged = canvas ? this.setCanvas(canvas) : false;
    const paletteChanged = this.setPalette(palette);
    const lockFrameChanged = this.setLockFrame(lockFrame); // true/false

    const shouldUpdate = canvasChanged || paletteChanged || lockFrameChanged;

    if (!shouldUpdate) {
      return;
    }

    const canvases: SourceCanvases = this.setTiles(tiles);

    const newHeight = this.getHeight();

    if (!this.canvas) {
      return;
    }

    if (newHeight === 0) {
      this.canvas.height = 0;
      return;
    }

    if (this.canvas.height !== newHeight) {
      this.canvas.height = newHeight;
    }

    const context = this.canvas?.getContext('2d');
    if (!context) {
      return;
    }

    this.blendCanvases(context, canvases);
  }

  private setPalette(palette: RGBNPalette) {
    if (!palette) {
      return false;
    }

    if (JSON.stringify(this.palette) === JSON.stringify(palette)) {
      return false;
    }

    this.palette = palette;
    return true;
  }

  private setCanvas(canvas: HTMLCanvasElement) {
    if (this.canvas === canvas) {
      return false;
    }

    this.canvas = canvas;
    return true;
  }

  private setLockFrame(lockFrame: boolean): boolean {
    if (lockFrame !== this.lockFrame) {
      this.lockFrame = lockFrame;
      return true;
    }

    return false;
  }

  private setTiles(tiles: RGBNTiles): SourceCanvases {
    const canvases: SourceCanvases = channels.reduce((acc, key): SourceCanvases => {
      const channel = this.channels[key];
      channel.tiles = tiles[key];
      const channelColors = this.palette[key];
      const paletteFunction = paletteFunctions[key];

      if (!channel.tiles || !channelColors) {
        return acc;
      }

      const palette = [
        paletteFunction(channelColors[3]),
        paletteFunction(channelColors[2]),
        paletteFunction(channelColors[1]),
        paletteFunction(channelColors[0]),
      ];

      channel.decoder.update({
        invertPalette: false,
        canvas: channel.canvas,
        tiles: channel.tiles,
        lockFrame: this.lockFrame,
        palette,
      });

      return {
        ...acc,
        [key]: channel.canvas,
      };
    }, {});

    return canvases;
  }

  private blendCanvases(targetContext: CanvasRenderingContext2D, sourceCanvases: SourceCanvases) {
    channels.forEach((key) => {
      const sourceCanvas = sourceCanvases[key];
      if (sourceCanvas && sourceCanvas.width && sourceCanvas.height) {
        if (key === ChannelKey.N) {

          // Normal blendmode means: skip N-Layer
          if (this.palette.blend === BlendMode.NORMAL) {
            return;
          }

          // eslint-disable-next-line no-param-reassign
          targetContext.globalCompositeOperation = blendModeNewName(this.palette.blend);
        } else {
          // eslint-disable-next-line no-param-reassign
          targetContext.globalCompositeOperation = 'lighter';
        }

        targetContext.drawImage(sourceCanvas, 0, 0);
      }
    });
  }

  public getScaledCanvas(
    scaleFactor: number,
    handleExportFrame: ExportFrameMode = ExportFrameMode.FRAMEMODE_KEEP,
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');

    const handleFrameMode = (this.maxTiles() === 360) ? handleExportFrame : ExportFrameMode.FRAMEMODE_KEEP;
    const { initialHeight, initialWidth } = Decoder.getScaledCanvasSize(handleFrameMode, this.getHeight());

    canvas.width = initialWidth * scaleFactor;
    canvas.height = initialHeight * scaleFactor;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('no canvas context');
    }

    const canvases: SourceCanvases = channels.reduce((acc: SourceCanvases, key: ChannelKey): SourceCanvases => {
      const channel = this.channels[key];
      const channelCanvas = channel.decoder.getScaledCanvas(scaleFactor, handleExportFrame);

      return {
        ...acc,
        [key]: channelCanvas,
      };
    }, {});

    this.blendCanvases(context, canvases);

    return canvas;
  }

  private maxTiles() {
    return Math.max(...channels.map((key) => (
      this.channels[key].tiles?.length || 0
    )));
  }

  private getHeight() {
    return TILE_PIXEL_HEIGHT * Math.ceil(this.maxTiles() / TILES_PER_LINE);
  }
}

export default RGBNDecoder;
