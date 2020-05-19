// Tile Constants
import Decoder from '../Decoder';

const GREYS = [0xff, 0xaa, 0x55, 0x00];

class RGBNDecoder extends Decoder {

  // for the RGBN Image the "palette" does not exist and therefore never change
  setPalette() {
    return false;
  }

  decodeTile({ r, g, b, n }) {
    return {
      r: super.decodeTile(r),
      g: super.decodeTile(g),
      b: super.decodeTile(b),
      n: super.decodeTile(n),
    };
  }

  getRGBValue({ r, g, b, n }, index) {

    const valueN = GREYS[n[index]];

    return {
      r: GREYS[r[index]] * valueN / 0xff,
      g: GREYS[g[index]] * valueN / 0xff,
      b: GREYS[b[index]] * valueN / 0xff,
    };
  }

  // RGBN image has always a height of 144
  getHeight() {
    return 144;
  }

  static rgbnTiles([r, g, b, n]) {
    return [...Array(360)].map((_, i) => ({
      r: r ? r[i] : ''.padStart(32, '0'),
      g: g ? g[i] : ''.padStart(32, '0'),
      b: b ? b[i] : ''.padStart(32, '0'),
      n: n ? n[i] : ''.padStart(32, '0'),
    }));
  }
}

export default RGBNDecoder;
