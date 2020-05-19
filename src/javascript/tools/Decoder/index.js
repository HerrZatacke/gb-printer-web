// Tile Constants
const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const TILES_PER_LINE = 20;

class Decoder {

  constructor() {
    this.canvas = null;
    this.tiles = [];
    this.colors = [];
    this.rawImageData = [];
  }

  update(canvas, palette, tiles) {

    const canvasChanged = this.setCanvas(canvas); // true/false
    const paletteChanged = this.setPalette(palette); // true/false

    if (canvasChanged || paletteChanged || !this.tiles.length) {
      this.tiles = [];
    }

    const tilesChanged = this.setTiles(tiles); // returns actual list of tiles that have changed

    const newHeight = this.getHeight();

    if (newHeight === 0) {
      this.canvas.height = 0;
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

  getScaledCanvas(scaleFactor) {
    const initialWidth = this.canvas.width;
    const initialHeight = this.canvas.height;

    const scaledCanvas = document.createElement('canvas');
    const scaledContext = scaledCanvas.getContext('2d');
    scaledCanvas.width = initialWidth * scaleFactor;
    scaledCanvas.height = initialHeight * scaleFactor;

    this.tiles.forEach((tile, index) => {
      this.paintTileScaled(this.decodeTile(tile), index, scaledContext, scaleFactor);
    });

    return scaledCanvas;
  }

  setCanvas(canvas) {
    if (this.canvas === canvas) {
      return false;
    }

    this.canvas = canvas;
    return true;
  }

  setPalette(palette) {
    if (JSON.stringify(this.colors) === JSON.stringify(palette)) {
      return false;
    }

    this.colors = palette;

    this.colorData = this.colors.map((color) => (
      // ensure correct hex string length
      color.length !== 7 ? null : parseInt(color.substring(1), 16)
    ));

    return true;
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
  decodeTile(rawBytes) {
    const bytes = rawBytes.replace(/[^0-9A-F]/ig, '').padEnd(32, 'f');

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
        const value = this.colorData[pixels[(y * TILE_PIXEL_WIDTH) + x]];

        // eslint-disable-next-line no-bitwise
        this.rawImageData[rawIndex] = (value & 0xff0000) >> 16;
        // eslint-disable-next-line no-bitwise
        this.rawImageData[rawIndex + 1] = (value & 0x00ff00) >> 8;
        // eslint-disable-next-line no-bitwise
        this.rawImageData[rawIndex + 2] = (value & 0x0000ff);
        this.rawImageData[rawIndex + 3] = 255;
      }
    }
  }

  paintTileScaled(pixels, index, canvasContext, pixelSize) {
    const tileXOffset = index % TILES_PER_LINE;
    const tileYOffset = Math.floor(index / TILES_PER_LINE);

    const pixelXOffset = TILE_PIXEL_WIDTH * tileXOffset * pixelSize;
    const pixelYOffset = TILE_PIXEL_HEIGHT * tileYOffset * pixelSize;

    // pixels along the tile's x axis
    for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
      for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
        // pixels along the tile's y axis

        // Pixel Color
        // eslint-disable-next-line no-param-reassign
        canvasContext.fillStyle = this.colors[pixels[(y * TILE_PIXEL_WIDTH) + x]];

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
