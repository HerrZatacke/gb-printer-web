// Tile Constants
import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';

const black = 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF';
const white = '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00';

const blackLine = Array(20).fill(black);
const whiteLine = Array(20).fill(white);

const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const TILES_PER_LINE = 20;

class Decoder {

  constructor() {
    this.canvas = null;
    this.tiles = [];
    this.colors = [];
    this.rawImageData = [];
    this.lockFrame = false;
    this.invertPalette = false;
    this.bwPalette = [0xffffff, 0xaaaaaa, 0x555555, 0x000000];

    this.tileIndexIsFramePart = tileIndexIsPartOfFrame;
  }

  update({
    canvas = null,
    tiles = [],
    palette = [],
    lockFrame = false,
    invertPalette = false,
  }) {

    const canvasChanged = this.setCanvas(canvas); // true/false
    const paletteChanged = this.setPalette(palette, invertPalette); // true/false
    const lockFrameChanged = this.setLockFrame(lockFrame); // true/false

    if (canvasChanged || paletteChanged || lockFrameChanged || !this.tiles.length) {
      this.tiles = [];
    }

    const tilesChanged = this.setTiles(tiles); // returns actual list of tiles that have changed

    const newHeight = this.getHeight();

    if (newHeight === 0) {
      this.canvas.height = 0;
      return;
    }

    if (!this.canvas) {
      return;
    }

    if (this.canvas.height !== newHeight || !this.rawImageData.length) {
      this.canvas.height = newHeight;

      // copy existing image data and add the missing space for additional height
      const newRawImageData = new Uint8ClampedArray(160 * newHeight * 4);
      this.rawImageData.forEach((value, index) => {
        newRawImageData[index] = value;
      });
      this.rawImageData = newRawImageData;
    }

    tilesChanged.forEach(({ index, newTile }) => {
      this.renderTile(index, newTile);
    });

    this.updateCanvas(newHeight);
  }

  updateCanvas(newHeight) {

    const context = this.canvas.getContext('2d');
    let imageData;

    // IE11 canot create an ImageData object - so I reuse the existing imagedata and overwrite each byte manually
    try {
      imageData = new ImageData(this.rawImageData, 160, newHeight);
    } catch (error) {
      imageData = context.getImageData(0, 0, 160, newHeight);
      this.rawImageData.forEach((value, index) => {
        imageData.data[index] = value;
      });
    }

    context.putImageData(imageData, 0, 0);
  }

  getScaledCanvas(scaleFactor, handleExportFrame = 'keep') {

    // crop and square modes are only available for regular "camera" images
    const handleFrameMode = (this.tiles.length === 360) ? handleExportFrame : 'keep';
    const { initialHeight, initialWidth, tilesPerLine, crop } = this.getScaleCanvasSize(handleFrameMode);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = initialWidth * scaleFactor;
    canvas.height = initialHeight * scaleFactor;

    this.getExportTiles(handleFrameMode)
      .forEach((tile, index) => {
        this.paintTileScaled(this.decodeTile(tile), index, context, scaleFactor, tilesPerLine, crop);
      });

    return canvas;
  }

  getScaleCanvasSize(handleExportFrame) {
    // 2 tiles top/left/bottom/right -> 4 tiles to each side
    const FRAME_TILES = 4;

    switch (handleExportFrame) {
      case 'keep':
        return {
          initialHeight: this.getHeight(),
          initialWidth: TILES_PER_LINE * TILE_PIXEL_WIDTH,
          tilesPerLine: TILES_PER_LINE,
          crop: false,
        };
      case 'crop':
        return {
          initialHeight: this.getHeight() - (TILE_PIXEL_HEIGHT * FRAME_TILES),
          initialWidth: (TILES_PER_LINE * TILE_PIXEL_WIDTH) - (TILE_PIXEL_WIDTH * FRAME_TILES),
          tilesPerLine: TILES_PER_LINE - FRAME_TILES,
          crop: true,
        };
      case 'square_black':
      case 'square_white':
      case 'square_smart':
        return {
          initialHeight: this.getHeight() + (2 * TILE_PIXEL_HEIGHT),
          initialWidth: TILES_PER_LINE * TILE_PIXEL_WIDTH,
          tilesPerLine: TILES_PER_LINE,
          crop: false,
        };
      default:
        throw new Error(`unknown export mode ${handleExportFrame}`);
    }
  }

  getExportTiles(handleExportFrame) {
    switch (handleExportFrame) {
      case 'keep':
        return this.tiles;
      case 'crop':
        return this.tiles
          .map((tile, index) => (
            this.tileIndexIsFramePart(index) ? null : tile
          ))
          .filter(Boolean);
      case 'square_black':
        return [
          ...blackLine,
          ...this.tiles,
          ...blackLine,
        ];
      case 'square_white':
        return [
          ...whiteLine,
          ...this.tiles,
          ...whiteLine,
        ];
      case 'square_smart':
        return [
          ...this.smartTile('first'),
          ...this.tiles,
          ...this.smartTile('last'),
        ];
      default:
        throw new Error(`unknown export mode ${handleExportFrame}`);
    }
  }

  smartTile(where) {
    switch (where) {
      case 'first':
        return this.tiles.slice(0, 20)
          .map((tile) => (
            Array(8).fill(tile.slice(0, 4)).join('')
          ));

      case 'last':
        return this.tiles.slice(340, 360)
          .map((tile) => (
            Array(8).fill(tile.slice(28, 32)).join('')
          ));

      default:
        return blackLine;
    }
  }

  setCanvas(canvas) {
    if (this.canvas === canvas) {
      return false;
    }

    this.canvas = canvas;
    return true;
  }

  setPalette(palette, invertPalette) {
    if (
      JSON.stringify(this.colors) === JSON.stringify(palette) &&
      this.invertPalette === invertPalette
    ) {
      return false;
    }

    this.colors = palette;
    this.invertPalette = invertPalette;

    this.colorData = this.colors.map((color) => (
      // ensure correct hex string length
      color.length !== 7 ? null : parseInt(color.substring(1), 16)
    ));

    return true;
  }

  setLockFrame(lockFrame) {
    if (lockFrame !== this.lockFrame) {
      this.lockFrame = lockFrame;
      return true;
    }

    return false;
  }

  setTiles(tiles) {

    const changedTiles = tiles
      .map((newTile, index) => {
        const changed = newTile !== this.tiles[index];

        if (!changed) {
          return null;
        }

        return {
          index,
          newTile,
        };
      })
      .filter(Boolean);

    this.tiles = tiles;
    return changedTiles;
  }

  renderTile(tileIndex, rawLine) {
    const tile = this.decodeTile(rawLine);
    this.paintTile(tile, tileIndex);
  }

  // Gameboy tile decoder function from http://www.huderlem.com/demos/gameboy2bpp.html
  decodeTile(rawBytes = black) {
    const bytes = rawBytes.replace(/[^0-9A-F]/ig, '')
      .padEnd(32, 'f');

    const byteArray = new Array(16);
    for (let i = 0; i < byteArray.length; i += 1) {
      byteArray[i] = parseInt(bytes.substr(i * 2, 2), 16);
    }

    const pixels = new Array(TILE_PIXEL_WIDTH * TILE_PIXEL_HEIGHT);

    for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
      for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
        // eslint-disable-next-line no-bitwise
        const hiBit = (byteArray[(y * 2) + 1] >> (7 - x)) & 1;
        // eslint-disable-next-line no-bitwise
        const loBit = (byteArray[y * 2] >> (7 - x)) & 1;
        // eslint-disable-next-line no-bitwise
        pixels[(y * TILE_PIXEL_WIDTH) + x] = (hiBit << 1) | loBit;
      }
    }

    return pixels;
  }

  getRGBValue(pixels, index, tileIndex, cropFrame) {
    const palette = (
      this.lockFrame && // Must be actually locked
      !cropFrame &&
      this.tileIndexIsFramePart(tileIndex) // Current tile must be in a "lockable" position
    ) ? this.bwPalette : this.colorData;
    const value = this.invertPalette ? palette[3 - pixels[index]] : palette[pixels[index]];

    return {
      // eslint-disable-next-line no-bitwise
      r: (value & 0xff0000) >> 16,
      // eslint-disable-next-line no-bitwise
      g: (value & 0x00ff00) >> 8,
      // eslint-disable-next-line no-bitwise
      b: (value & 0x0000ff),
    };
  }

  // This paints the tile with a specified offset and pixel width
  paintTile(pixels, index) {
    const tileXOffset = index % TILES_PER_LINE;
    const tileYOffset = Math.floor(index / TILES_PER_LINE);

    const pixelXOffset = TILE_PIXEL_WIDTH * tileXOffset;
    const pixelYOffset = TILE_PIXEL_HEIGHT * tileYOffset;

    // pixels along the tile's x axis
    for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
      for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
        // pixels along the tile's y axis

        const rawIndex = (pixelXOffset + x + ((pixelYOffset + y) * 160)) * 4;
        const color = this.getRGBValue(pixels, (y * TILE_PIXEL_WIDTH) + x, index, false);

        this.rawImageData[rawIndex] = color.r;
        this.rawImageData[rawIndex + 1] = color.g;
        this.rawImageData[rawIndex + 2] = color.b;
        this.rawImageData[rawIndex + 3] = 255;
      }
    }
  }

  paintTileScaled(pixels, index, canvasContext, pixelSize, tilesPerLine, cropFrame = false) {
    const tileXOffset = index % tilesPerLine;
    const tileYOffset = Math.floor(index / tilesPerLine);

    const pixelXOffset = TILE_PIXEL_WIDTH * tileXOffset * pixelSize;
    const pixelYOffset = TILE_PIXEL_HEIGHT * tileYOffset * pixelSize;

    // pixels along the tile's x axis
    for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
      for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
        // pixels along the tile's y axis

        const color = this.getRGBValue(pixels, (y * TILE_PIXEL_WIDTH) + x, index, cropFrame);
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

  getHeight() {
    return TILE_PIXEL_HEIGHT * Math.ceil(this.tiles.length / TILES_PER_LINE);
  }
}

export default Decoder;
