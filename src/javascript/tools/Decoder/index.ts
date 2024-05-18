// Tile Constants
import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';
import { BWPalette, IndexedTilePixels } from '../../../types/FixedArray';
import { ExportFrameMode } from '../../consts/exportFrameModes';
import { BLACK_LINE, BW_PALETTE, TILE_PIXEL_HEIGHT, TILE_PIXEL_WIDTH, TILES_PER_LINE, WHITE_LINE } from './constants';
import { decodeTile, getRGBValue } from './functions';
import { ChangedTile, ScaledCanvasSize } from './types';

class Decoder {
  private canvas: HTMLCanvasElement | null;
  private tiles: string[];
  private colors: string[];
  private rawImageData: Uint8ClampedArray | null;
  private lockFrame: boolean;
  private invertPalette: boolean;
  private colorData: BWPalette;

  constructor() {
    this.canvas = null;
    this.tiles = [];
    this.colors = [];
    this.rawImageData = null;
    this.lockFrame = false;
    this.invertPalette = false;
    this.colorData = [...BW_PALETTE];
  }

  public update({
    canvas = null,
    tiles = [],
    palette = [],
    lockFrame = false,
    invertPalette = false,
  }: {
    canvas: HTMLCanvasElement | null,
    tiles: string[],
    palette: string[],
    lockFrame: boolean,
    invertPalette: boolean,
  }) {
    const canvasChanged = canvas ? this.setCanvas(canvas) : false;
    const paletteChanged = palette ? this.setPalette(palette, invertPalette) : false;
    const lockFrameChanged = this.setLockFrame(lockFrame); // true/false

    if (canvasChanged || paletteChanged || lockFrameChanged || !this.tiles.length) {
      this.tiles = [];
    }

    const tilesChanged: ChangedTile[] = this.setTiles(tiles); // returns actual list of tiles that have changed

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

  private updateCanvas(newHeight: number) {
    if (!this.canvas || !this.rawImageData?.length) {
      return;
    }

    const context = this.canvas.getContext('2d');
    const imageData = new ImageData(this.rawImageData, 160, newHeight);
    context?.putImageData(imageData, 0, 0);
  }

  public getScaledCanvas(
    scaleFactor: number,
    handleExportFrame: ExportFrameMode = ExportFrameMode.FRAMEMODE_KEEP,
  ): HTMLCanvasElement {

    // crop and square modes are only available for regular "camera" images
    const handleFrameMode = (this.tiles.length === 360) ? handleExportFrame : ExportFrameMode.FRAMEMODE_KEEP;
    const {
      initialHeight,
      initialWidth,
      tilesPerLine,
    } = Decoder.getScaledCanvasSize(handleFrameMode, this.getHeight());

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('no canvas context');
    }

    canvas.width = initialWidth * scaleFactor;
    canvas.height = initialHeight * scaleFactor;

    this.getExportTiles(handleFrameMode)
      .forEach((tile, index) => {
        this.paintTileScaled(decodeTile(tile), index, context, scaleFactor, tilesPerLine, handleExportFrame);
      });

    return canvas;
  }

  static getScaledCanvasSize(handleExportFrame: ExportFrameMode, height: number): ScaledCanvasSize {
    // 2 tiles top/left/bottom/right -> 4 tiles to each side
    const FRAME_TILES = 4;

    switch (handleExportFrame) {
      case ExportFrameMode.FRAMEMODE_KEEP:
        return {
          initialHeight: height,
          initialWidth: TILES_PER_LINE * TILE_PIXEL_WIDTH,
          tilesPerLine: TILES_PER_LINE,
        };
      case ExportFrameMode.FRAMEMODE_CROP:
        return {
          initialHeight: height - (TILE_PIXEL_HEIGHT * FRAME_TILES),
          initialWidth: (TILES_PER_LINE * TILE_PIXEL_WIDTH) - (TILE_PIXEL_WIDTH * FRAME_TILES),
          tilesPerLine: TILES_PER_LINE - FRAME_TILES,
        };
      case ExportFrameMode.FRAMEMODE_SQUARE_BLACK:
      case ExportFrameMode.FRAMEMODE_SQUARE_WHITE:
        return {
          initialHeight: height + (2 * TILE_PIXEL_HEIGHT),
          initialWidth: TILES_PER_LINE * TILE_PIXEL_WIDTH,
          tilesPerLine: TILES_PER_LINE,
        };
      default:
        throw new Error(`unknown export mode ${handleExportFrame}`);
    }
  }

  private getExportTiles(handleExportFrame: ExportFrameMode): string[] {
    if (!this.tiles) {
      throw new Error('no tiles to export');
    }

    switch (handleExportFrame) {
      case ExportFrameMode.FRAMEMODE_KEEP:
        return this.tiles;
      case ExportFrameMode.FRAMEMODE_CROP:
        return this.tiles
          .reduce((acc: string[], tile: string, index: number) => (
            tileIndexIsPartOfFrame(index, ExportFrameMode.FRAMEMODE_KEEP) ?
              acc :
              [...acc, tile]
          ), []);
      case ExportFrameMode.FRAMEMODE_SQUARE_BLACK:
        return [
          ...BLACK_LINE,
          ...this.tiles,
          ...BLACK_LINE,
        ];
      case ExportFrameMode.FRAMEMODE_SQUARE_WHITE:
        return [
          ...WHITE_LINE,
          ...this.tiles,
          ...WHITE_LINE,
        ];
      default:
        throw new Error(`unknown export mode ${handleExportFrame}`);
    }
  }

  private setCanvas(canvas: HTMLCanvasElement) {
    if (this.canvas === canvas) {
      return false;
    }

    this.canvas = canvas;
    return true;
  }

  private setPalette(palette: string[], invertPalette: boolean): boolean {
    if (
      this.colors[0] === palette[0] &&
      this.colors[1] === palette[1] &&
      this.colors[2] === palette[2] &&
      this.colors[3] === palette[3] &&
      this.invertPalette === invertPalette
    ) {
      return false;
    }

    this.colors = palette;
    this.invertPalette = invertPalette;

    this.colors.forEach((color: string, index: number) => {
      this.colorData[index] = (
        color.length !== 7 ? BW_PALETTE[index] : parseInt(color.substring(1), 16)
      );
    });

    return true;
  }

  private setLockFrame(lockFrame: boolean): boolean {
    if (lockFrame !== this.lockFrame) {
      this.lockFrame = lockFrame;
      return true;
    }

    return false;
  }

  private setTiles(tiles: string[]): ChangedTile[] {

    const changedTiles = tiles
      .reduce((acc: ChangedTile[], newTile: string, index: number) => {
        const changed = newTile !== this.tiles[index];

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

  private renderTile(tileIndex: number, rawLine: string) {
    const tile = decodeTile(rawLine);
    this.paintTile(tile, tileIndex);
  }

  // This paints the tile with a specified offset and pixel width
  private paintTile(pixels: IndexedTilePixels, index: number) {
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

        const color = getRGBValue({
          pixels,
          index: (y * TILE_PIXEL_WIDTH) + x,
          tileIndex: index,
          handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
          invertPalette: this.invertPalette,
          lockFrame: this.lockFrame,
          colorData: this.colorData,
        });

        this.rawImageData[rawIndex] = color.r;
        this.rawImageData[rawIndex + 1] = color.g;
        this.rawImageData[rawIndex + 2] = color.b;
        this.rawImageData[rawIndex + 3] = 255;
      }
    }
  }

  private paintTileScaled(
    pixels: IndexedTilePixels,
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

        const color = getRGBValue({
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

  private getHeight(): number {
    return TILE_PIXEL_HEIGHT * Math.ceil(this.tiles.length / TILES_PER_LINE);
  }
}

export default Decoder;
