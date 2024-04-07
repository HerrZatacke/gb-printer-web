import { blendModeFunctions, BlendMode } from './blendModes';
import {
  BLACK_LINE,
  BW_PALETTE,
  TILE_PIXEL_HEIGHT,
  TILE_PIXEL_WIDTH,
  TILES_PER_LINE,
  WHITE_LINE,
} from '../Decoder/constants';
import { BWPalette } from '../../../types/FixedArray';
import { decodeTile, getRGBValue } from '../Decoder/functions';
import { ExportFrameMode } from '../../consts/exportFrameModes';
import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';
import { RGBNPalette } from '../../../types/Image';
import {
  ChangedRGBNTile,
  IndexedRGBNValue,
  RGBNIndexedTilePixels,
  RGBNTile,
  RGBValue,
  ScaledCanvasSize,
} from '../Decoder/types';

const defaultPalette: RGBNPalette = {
  r: [0, 84, 172, 255],
  g: [0, 84, 172, 255],
  b: [0, 84, 172, 255],
  n: [0, 85, 170, 255],
  blend: BlendMode.MULTIPLY,
};

class RGBNDecoder {
  private blackLine: RGBNTile[];
  private whiteLine: RGBNTile[];

  private canvas: HTMLCanvasElement | null;
  private tiles: RGBNTile[];
  // private colors: string[];
  private rawImageData: Uint8ClampedArray | null;
  private lockFrame: boolean;
  private invertPalette: boolean;
  private colorData: BWPalette;
  private palette: RGBNPalette;

  constructor() {
    this.canvas = null;
    this.tiles = [];
    // this.colors = [];
    this.rawImageData = null;
    this.lockFrame = false;
    this.invertPalette = false;
    this.colorData = [...BW_PALETTE];
    this.palette = defaultPalette;

    this.blackLine = RGBNDecoder.rgbnTiles([
      BLACK_LINE,
      BLACK_LINE,
      BLACK_LINE,
      BLACK_LINE,
    ]);

    this.whiteLine = RGBNDecoder.rgbnTiles([
      WHITE_LINE,
      WHITE_LINE,
      WHITE_LINE,
      WHITE_LINE,
    ]);
  }

  public update({
    canvas = null,
    tiles = [],
    palette,
    lockFrame = false,
  }: {
    canvas: HTMLCanvasElement | null,
    tiles: RGBNTile[],
    palette: RGBNPalette
    lockFrame: boolean,
  }) {
    const canvasChanged = canvas ? this.setCanvas(canvas) : false;
    const paletteChanged = this.setPalette(palette);
    const lockFrameChanged = this.setLockFrame(lockFrame); // true/false

    if (canvasChanged || paletteChanged || lockFrameChanged || !this.tiles.length) {
      this.tiles = [];
    }

    const tilesChanged: ChangedRGBNTile[] = this.setTiles(tiles); // returns actual list of tiles that have changed

    const newHeight = this.getHeight();

    if (!this.canvas) {
      return;
    }

    if (newHeight === 0) {
      this.canvas.height = 0;
      return;
    }


    if (this.canvas.height !== newHeight || !this.rawImageData?.length) {
      this.canvas.height = newHeight;

      // copy existing image data and add the missing space for additional height
      const newRawImageData = new Uint8ClampedArray(160 * newHeight * 4);
      this.rawImageData?.forEach((value, index) => {
        newRawImageData[index] = value;
      });
      this.rawImageData = newRawImageData;
    }

    tilesChanged.forEach(({ index, newTile }) => {
      this.renderTile(index, newTile);
    });

    this.updateCanvas(newHeight);
  }

  setPalette(palette: RGBNPalette) {
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

  private updateCanvas(newHeight: number) {
    if (!this.canvas || !this.rawImageData?.length) {
      return;
    }

    const context = this.canvas.getContext('2d');
    const imageData = new ImageData(this.rawImageData, 160, newHeight);
    context?.putImageData(imageData, 0, 0);
  }

  private setLockFrame(lockFrame: boolean): boolean {
    if (lockFrame !== this.lockFrame) {
      this.lockFrame = lockFrame;
      return true;
    }

    return false;
  }

  private setTiles(tiles: RGBNTile[]): ChangedRGBNTile[] {

    const changedTiles = tiles
      .reduce((acc: ChangedRGBNTile[], newTile: RGBNTile, index: number) => {

        const changed =
          newTile.r !== this.tiles[index]?.r ||
          newTile.g !== this.tiles[index]?.g ||
          newTile.b !== this.tiles[index]?.b ||
          newTile.n !== this.tiles[index]?.n;

        if (!changed) {
          return acc;
        }

        return [
          ...acc,
          {
            index,
            newTile,
          },
        ];
      }, []);

    this.tiles = tiles;
    return changedTiles;
  }

  private renderTile(tileIndex: number, rgbnTile: RGBNTile) {
    const tile = this.decodeRGBNTile(rgbnTile);
    this.paintTile(tile, tileIndex);
  }

  private decodeRGBNTile({ r, g, b, n }: RGBNTile): RGBNIndexedTilePixels {
    return {
      r: decodeTile(r),
      g: decodeTile(g),
      b: decodeTile(b),
      n: n ? decodeTile(n) : undefined, // neutral image not neccesarily required
    };
  }

  private getRGBNRGBValue({
    pixels: { r, g, b, n },
    index,
    tileIndex,
    handleExportFrame,
    lockFrame,
    invertPalette,
    colorData,
  }: {
    pixels: RGBNIndexedTilePixels,
    index: number,
    tileIndex: number,
    handleExportFrame: ExportFrameMode,
    lockFrame: boolean,
    invertPalette: boolean,
    colorData: BWPalette,
  }): RGBValue {
    if (
      lockFrame &&
      handleExportFrame !== ExportFrameMode.FRAMEMODE_CROP &&
      tileIndexIsPartOfFrame(tileIndex, handleExportFrame) &&
      n
    ) {
      try {
        return getRGBValue({
          pixels: n,
          index,
          tileIndex,
          handleExportFrame,
          lockFrame,
          invertPalette,
          colorData,
        });
      } catch (error) {
        return { r: 0, g: 0, b: 0 };
      }
    }

    const indexedRGBN: IndexedRGBNValue = {
      r: r[index],
      g: g[index],
      b: b[index],
      n: n ? n[index] : undefined, // 'undefined' is required for blending if no neutral layer exists
    };

    return this.blendColors(indexedRGBN);
  }

  private paintTile(pixels: RGBNIndexedTilePixels, index: number) {
    if (!this.rawImageData) {
      return;
    }

    const tileXOffset = index % TILES_PER_LINE;
    const tileYOffset = Math.floor(index / TILES_PER_LINE);

    const pixelXOffset = TILE_PIXEL_WIDTH * tileXOffset;
    const pixelYOffset = TILE_PIXEL_HEIGHT * tileYOffset;

    // pixels along the tile's x axis
    for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
      for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
        // pixels along the tile's y axis

        const rawIndex = (pixelXOffset + x + ((pixelYOffset + y) * 160)) * 4;
        const color = this.getRGBNRGBValue({
          pixels,
          index: (y * TILE_PIXEL_WIDTH) + x,
          tileIndex: index,
          handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
          lockFrame: this.lockFrame,
          invertPalette: this.invertPalette,
          colorData: this.colorData,
        });

        this.rawImageData[rawIndex] = color.r;
        this.rawImageData[rawIndex + 1] = color.g;
        this.rawImageData[rawIndex + 2] = color.b;
        this.rawImageData[rawIndex + 3] = 255;
      }
    }
  }

  private blendColors({ r, g, b, n }: IndexedRGBNValue): RGBValue {

    const getPaletteValue = (key: 'r'|'g'|'b'|'n', colorIndex: number) => (
      this.palette[key]?.[3 - colorIndex] || defaultPalette[key]?.[3 - colorIndex] || 0
    );

    const rgbValues: RGBValue = {
      r: getPaletteValue('r', r),
      g: getPaletteValue('g', g),
      b: getPaletteValue('b', b),
    };

    // no blending if neutral layer does not exist
    if (typeof n === 'undefined') {
      return rgbValues;
    }

    const blendMode = this.palette.blend || BlendMode.MULTIPLY;

    if (!blendModeFunctions[blendMode]) {
      return rgbValues;
    }

    const callBlendFunction = (value: number, neutral: number) => (
      Math.max(
        0,
        Math.min(
          1,
          blendModeFunctions[blendMode](value / 255, neutral / 255),
        ),
      ) * 255
    );

    const nValue = getPaletteValue('n', n);

    return {
      r: callBlendFunction(rgbValues.r, nValue),
      g: callBlendFunction(rgbValues.g, nValue),
      b: callBlendFunction(rgbValues.b, nValue),
    };
  }

  public getScaledCanvas(
    scaleFactor: number,
    handleExportFrame: ExportFrameMode = ExportFrameMode.FRAMEMODE_KEEP,
  ): HTMLCanvasElement {

    // crop and square modes are only available for regular "camera" images
    const handleFrameMode = (this.tiles.length === 360) ? handleExportFrame : ExportFrameMode.FRAMEMODE_KEEP;
    const { initialHeight, initialWidth, tilesPerLine } = this.getScaleCanvasSize(handleFrameMode);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('no canvas context');
    }

    canvas.width = initialWidth * scaleFactor;
    canvas.height = initialHeight * scaleFactor;

    this.getExportTiles(handleFrameMode)
      .forEach((tile, index) => {
        this.paintTileScaled(this.decodeRGBNTile(tile), index, context, scaleFactor, tilesPerLine, handleExportFrame);
      });

    return canvas;
  }

  private getScaleCanvasSize(handleExportFrame: ExportFrameMode): ScaledCanvasSize {
    // 2 tiles top/left/bottom/right -> 4 tiles to each side
    const FRAME_TILES = 4;

    switch (handleExportFrame) {
      case ExportFrameMode.FRAMEMODE_KEEP:
        return {
          initialHeight: this.getHeight(),
          initialWidth: TILES_PER_LINE * TILE_PIXEL_WIDTH,
          tilesPerLine: TILES_PER_LINE,
        };
      case ExportFrameMode.FRAMEMODE_CROP:
        return {
          initialHeight: this.getHeight() - (TILE_PIXEL_HEIGHT * FRAME_TILES),
          initialWidth: (TILES_PER_LINE * TILE_PIXEL_WIDTH) - (TILE_PIXEL_WIDTH * FRAME_TILES),
          tilesPerLine: TILES_PER_LINE - FRAME_TILES,
        };
      case ExportFrameMode.FRAMEMODE_SQUARE_BLACK:
      case ExportFrameMode.FRAMEMODE_SQUARE_WHITE:
        return {
          initialHeight: this.getHeight() + (2 * TILE_PIXEL_HEIGHT),
          initialWidth: TILES_PER_LINE * TILE_PIXEL_WIDTH,
          tilesPerLine: TILES_PER_LINE,
        };
      default:
        throw new Error(`unknown export mode ${handleExportFrame}`);
    }
  }

  private getExportTiles(handleExportFrame: ExportFrameMode): RGBNTile[] {
    if (!this.tiles) {
      throw new Error('no tiles to export');
    }

    switch (handleExportFrame) {
      case ExportFrameMode.FRAMEMODE_KEEP:
        return this.tiles;
      case ExportFrameMode.FRAMEMODE_CROP:
        return this.tiles
          .reduce((acc: RGBNTile[], tile: RGBNTile, index: number) => (
            tileIndexIsPartOfFrame(index, ExportFrameMode.FRAMEMODE_KEEP) ?
              acc :
              [...acc, tile]
          ), []);
      case ExportFrameMode.FRAMEMODE_SQUARE_BLACK:
        return [
          ...this.blackLine,
          ...this.tiles,
          ...this.blackLine,
        ];
      case ExportFrameMode.FRAMEMODE_SQUARE_WHITE:
        return [
          ...this.whiteLine,
          ...this.tiles,
          ...this.whiteLine,
        ];
      default:
        throw new Error(`unknown export mode ${handleExportFrame}`);
    }
  }

  private paintTileScaled(
    pixels: RGBNIndexedTilePixels,
    index: number,
    canvasContext: CanvasRenderingContext2D,
    pixelSize: number,
    tilesPerLine: number,
    handleExportFrame: ExportFrameMode,
  ) {
    const tileXOffset = index % tilesPerLine;
    const tileYOffset = Math.floor(index / tilesPerLine);

    const pixelXOffset = TILE_PIXEL_WIDTH * tileXOffset * pixelSize;
    const pixelYOffset = TILE_PIXEL_HEIGHT * tileYOffset * pixelSize;

    // pixels along the tile's x axis
    for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
      for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
        // pixels along the tile's y axis

        const color = this.getRGBNRGBValue({
          pixels,
          index: (y * TILE_PIXEL_WIDTH) + x,
          tileIndex: index,
          handleExportFrame,
          lockFrame: this.lockFrame,
          invertPalette: this.invertPalette,
          colorData: this.colorData,
        });


        // eslint-disable-next-line no-param-reassign
        canvasContext.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

        // Pixel Position (Needed to add +1 to pixel width and height to fill in a gap)
        canvasContext.fillRect(
          pixelXOffset + (x * pixelSize),
          pixelYOffset + (y * pixelSize),
          pixelSize + 1,
          pixelSize + 1,
        );
      }
    }
  }

  // RGBN image has always a height of 144
  private getHeight() {
    return 144;
  }

  public static rgbnTiles([r, g, b, n]: [string[], string[], string[], string[]]): RGBNTile[] {
    const lines = Math.max(
      r?.length || 0,
      g?.length || 0,
      b?.length || 0,
      n?.length || 0,
    );

    return [...Array(lines)].map((_, i): RGBNTile => ({
      r: r?.[i],
      g: g?.[i],
      b: b?.[i],
      n: n?.[i],
    }));
  }
}

export default RGBNDecoder;
