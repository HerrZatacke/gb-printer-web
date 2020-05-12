
// Tile Constants
const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const TILES_PER_LINE = 20;

class Decoder {

  constructor() {
    this.canvas = null;
    this.canvasContext = null;
    this.tileSize = null;
    this.tiles = [];
    this.colors = [];
  }

  update(canvas, palette, tiles) {

    const canvasChanged = this.setCanvas(canvas); // true/false
    const paletteChanged = this.setPalette(palette); // true/false
    const tilesChanged = this.setTiles(tiles); // actual list of tiles that have changed
    const newHeight = this.checkResize();

    // if canvas or palette have changed, or tiles were cleared, always do a full render
    if (canvasChanged || paletteChanged || !this.tiles.length) {
      this.canvasContext.fillStyle = this.colors[1];
      this.canvasContext.fillRect(0, 0, 160, newHeight);

      // This takes sooo much time... needs to be asynched in some way...
      window.setTimeout(() => {
        this.fullRender();
      }, Math.random() * 1500);

    } else if (tilesChanged.length) { // we have a list of some updated tiles
      tilesChanged.forEach(({ index, newTile }) => {
        this.renderTile(index, newTile);
      });
    }
  }

  setCanvas(canvas) {
    if (this.canvas === canvas) {
      return false;
    }

    this.canvas = canvas;
    this.canvasContext = this.canvas.getContext('2d');
    this.tileSize = this.canvas.width / (TILE_PIXEL_WIDTH * TILES_PER_LINE);

    return true;
  }

  setPalette(palette) {
    if (JSON.stringify(this.colors) === JSON.stringify(palette)) {
      return false;
    }

    this.colors = palette;

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

    if (!tile) {
      return;
    }

    this.paintTile(tile, tileIndex);
  }

  fullRender() {
    this.tiles.forEach((tile, index) => {
      this.renderTile(index, tile);
    });
  }

  // Gameboy tile decoder function from http://www.huderlem.com/demos/gameboy2bpp.html
  decodeTile(rawBytes) {
    const bytes = rawBytes.replace(/[^0-9A-F]/ig, '');
    if (bytes.length !== 32) {
      return false;
    }

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
    const pixelSize = this.canvas.width / (TILES_PER_LINE * TILE_PIXEL_WIDTH);

    const pixelXOffset = TILE_PIXEL_WIDTH * tileXOffset * pixelSize;
    const pixelYOffset = TILE_PIXEL_HEIGHT * tileYOffset * pixelSize;

    // pixels along the tile's x axis
    for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
      for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
        // pixels along the tile's y axis

        // Pixel Color
        this.canvasContext.fillStyle = this.colors[pixels[(y * TILE_PIXEL_WIDTH) + x]];

        // Pixel Position (Needed to add +1 to pixel width and height to fill in a gap)
        this.canvasContext.fillRect(
          pixelXOffset + (x * pixelSize),
          pixelYOffset + (y * pixelSize),
          pixelSize + 1,
          pixelSize + 1,
        );
      }
    }
  }

  checkResize() {
    const tileHeightCount = Math.ceil(this.tiles.length / TILES_PER_LINE);
    const newHeight = this.tileSize * TILE_PIXEL_HEIGHT * tileHeightCount;

    if (this.canvas.height !== newHeight) {
      if (this.canvas.height) {
        const imageData = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.height = newHeight;
        this.canvasContext.putImageData(imageData, 0, 0);
      } else {
        this.canvas.height = newHeight;
      }
    }

    return newHeight;
  }
}

export default Decoder;
