// Tile Constants
const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const TILES_PER_LINE = 20;

const GREYS = [0xff, 0xaa, 0x55, 0x00];

class RGBNDecoder {

  constructor() {
    this.canvas = null;
    this.tiles = [];
    this.rawImageData = [];
  }

  update(canvas, tilesR, tilesG, tilesB, tilesN) {

    const canvasChanged = this.setCanvas(canvas); // true/false

    if (canvasChanged || !this.tiles.length) {
      this.tiles = [];
    }

    this.setTiles(tilesR, tilesG, tilesB, tilesN);

    const newHeight = 144;

    const newRawImageData = new Uint8ClampedArray(160 * newHeight * 4);
    this.rawImageData.forEach((value, index) => {
      newRawImageData[index] = value;
    });

    this.rawImageData = newRawImageData;

    this.tiles.forEach((newTile, index) => {
      this.renderTile(index, newTile);
    });

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

  setTiles(r, g, b, n) {
    this.tiles = [...Array(360)].map((_, i) => ({
      r: r ? r[i] : ''.padStart(32, '0'),
      g: g ? g[i] : ''.padStart(32, '0'),
      b: b ? b[i] : ''.padStart(32, '0'),
      n: n ? n[i] : ''.padStart(32, '0'),
    }));
  }

  // getScaledCanvas(scaleFactor) {
  //   const initialWidth = this.canvas.width;
  //   const initialHeight = this.canvas.height;
  //
  //   const scaledCanvas = document.createElement('canvas');
  //   const scaledContext = scaledCanvas.getContext('2d');
  //   scaledCanvas.width = initialWidth * scaleFactor;
  //   scaledCanvas.height = initialHeight * scaleFactor;
  //
  //   this.tiles.forEach((tile, index) => {
  //     this.paintTileScaled(this.decodeTile(tile), index, scaledContext, scaleFactor);
  //   });
  //
  //   return scaledCanvas;
  // }

  setCanvas(canvas) {
    if (this.canvas === canvas) {
      return false;
    }

    this.canvas = canvas;
    return true;
  }

  renderTile(tileIndex, { r, g, b, n }) {

    const rendered = {
      r: this.decodeTile(r),
      g: this.decodeTile(g),
      b: this.decodeTile(b),
      n: this.decodeTile(n),
    };

    this.paintTile(rendered, tileIndex);
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
  paintTile({ r, g, b, n }, index) {
    const tileXOffset = index % TILES_PER_LINE;
    const tileYOffset = Math.floor(index / TILES_PER_LINE);

    const pixelXOffset = TILE_PIXEL_WIDTH * tileXOffset;
    const pixelYOffset = TILE_PIXEL_HEIGHT * tileYOffset;

    // pixels along the tile's x axis
    for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
      for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
        // pixels along the tile's y axis

        const rawIndex = (pixelXOffset + x + ((pixelYOffset + y) * 160)) * 4;

        const valueN = GREYS[n[(y * TILE_PIXEL_WIDTH) + x]];
        const valueR = GREYS[r[(y * TILE_PIXEL_WIDTH) + x]] * valueN / 0xff;
        const valueG = GREYS[g[(y * TILE_PIXEL_WIDTH) + x]] * valueN / 0xff;
        const valueB = GREYS[b[(y * TILE_PIXEL_WIDTH) + x]] * valueN / 0xff;

        // eslint-disable-next-line no-bitwise
        this.rawImageData[rawIndex] = valueR;
        // eslint-disable-next-line no-bitwise
        this.rawImageData[rawIndex + 1] = valueG;
        // eslint-disable-next-line no-bitwise
        this.rawImageData[rawIndex + 2] = valueB;
        this.rawImageData[rawIndex + 3] = 255;
      }
    }
  }

  // paintTileScaled(pixels, index, canvasContext, pixelSize) {
  //   const tileXOffset = index % TILES_PER_LINE;
  //   const tileYOffset = Math.floor(index / TILES_PER_LINE);
  //
  //   const pixelXOffset = TILE_PIXEL_WIDTH * tileXOffset * pixelSize;
  //   const pixelYOffset = TILE_PIXEL_HEIGHT * tileYOffset * pixelSize;
  //
  //   // pixels along the tile's x axis
  //   for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
  //     for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
  //       // pixels along the tile's y axis
  //
  //       // Pixel Color
  //       // eslint-disable-next-line no-param-reassign
  //       canvasContext.fillStyle = '#ff0000';
  //
  //       // Pixel Position (Needed to add +1 to pixel width and height to fill in a gap)
  //       canvasContext.fillRect(
  //         pixelXOffset + (x * pixelSize),
  //         pixelYOffset + (y * pixelSize),
  //         pixelSize + 1,
  //         pixelSize + 1,
  //       );
  //     }
  //   }
  // }

}

export default RGBNDecoder;
