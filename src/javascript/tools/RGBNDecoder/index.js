// Tile Constants
import Decoder from '../Decoder';

const TILE_PIXEL_WIDTH = 8;
const TILE_PIXEL_HEIGHT = 8;
const TILES_PER_LINE = 20;

const GREYS = [0xff, 0xaa, 0x55, 0x00];

class RGBNDecoder extends Decoder {

  constructor() {
    super();
    delete this.colors;
  }

  update(canvas, tiles) {

    const canvasChanged = this.setCanvas(canvas); // true/false

    if (canvasChanged || !this.tiles.length) {
      this.tiles = [];
    }

    const tilesChanged = this.setTiles(tiles); // returns actual list of tiles that have changed

    const newHeight = this.getHeight();

    this.canvas.height = newHeight;

    const newRawImageData = new Uint8ClampedArray(160 * newHeight * 4);
    this.rawImageData.forEach((value, index) => {
      newRawImageData[index] = value;
    });

    this.rawImageData = newRawImageData;

    tilesChanged.forEach(({ index, newTile }) => {
      this.renderTile(index, newTile);
    });

    this.updateCanvas(newHeight);
  }

  getScaledCanvas() {
    // eslint-disable-next-line no-console
    console.log('implement me!');
  }

  renderTile(tileIndex, { r, g, b, n }) {
    this.paintTile({
      r: this.decodeTile(r),
      g: this.decodeTile(g),
      b: this.decodeTile(b),
      n: this.decodeTile(n),
    }, tileIndex);
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

  paintTileScaled() {
    // eslint-disable-next-line no-console
    console.log('implement me!');
  }

  static rgbnTiles([r, g, b, n]) {
    return [...Array(360)].map((_, i) => ({
      r: r ? r[i] : ''.padStart(32, '0'),
      g: g ? g[i] : ''.padStart(32, '0'),
      b: b ? b[i] : ''.padStart(32, '0'),
      n: n ? n[i] : ''.padStart(32, '0'),
    }));
  }

  getHeight() {
    return 144;
  }
}

export default RGBNDecoder;
