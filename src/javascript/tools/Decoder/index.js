
// Tile Constants
const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const TILES_PER_LINE = 20;

class Decoder {

  constructor() {
    this.canvas = null;
    this.canvasContext = null;
    this.lastTileIndex = null;
    this.tileSize = null;
    this.tiles = [];
    this.colors = [];
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.canvasContext = this.canvas.getContext('2d');
    this.tileSize = this.canvas.width / (TILE_PIXEL_WIDTH * TILES_PER_LINE);
  }

  setPalette(palette) {
    this.colors = palette;
    this.fullRender();
  }

  clear() {
    this.lastTileIndex = 0;
    this.tiles = [];
  }

  line(index, rawLine) {

    this.lastTileIndex = index;
    const tile = this.decodeTile(rawLine);

    if (!tile) {
      return;
    }

    this.tiles[index] = rawLine;

    this.checkResize();
    this.renderTile(tile);
  }

  fullRender() {
    this.tiles.forEach((tile, index) => {
      this.line(index, tile);
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
  renderTile(pixels) {

    const tileXOffset = (this.lastTileIndex - 1) % TILES_PER_LINE;
    const tileYOffset = Math.floor((this.lastTileIndex - 1) / TILES_PER_LINE);
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
    const tileHeightCount = Math.ceil(this.lastTileIndex / TILES_PER_LINE);

    const newHeight = this.tileSize * TILE_PIXEL_HEIGHT * tileHeightCount;
    const imageData = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);

    if (this.canvas.height !== newHeight) {
      this.canvas.height = newHeight;
    }

    this.canvasContext.putImageData(imageData, 0, 0);
  }
}

export default Decoder;
