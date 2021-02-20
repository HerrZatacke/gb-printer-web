import Decoder from '../Decoder';

class RGBNDecoder extends Decoder {

  // for the RGBN Image the "palette" does not exist and therefore never change
  setPalette(palette) {
    if (!palette) {
      return false;
    }

    if (JSON.stringify(this.palette) === JSON.stringify(palette)) {
      return false;
    }

    this.palette = palette;
    return true;
  }

  decodeTile({ r, g, b, n }) {
    return {
      r: super.decodeTile(r),
      g: super.decodeTile(g),
      b: super.decodeTile(b),
      n: super.decodeTile(n),
    };
  }

  getRGBValue({ r, g, b, n }, index, tileIndex, cropFrame) {

    if (
      this.lockFrame &&
      !cropFrame &&
      this.tileIndexIsFramePart(tileIndex)
    ) {
      return super.getRGBValue(n, index, tileIndex, cropFrame);
    }

    const valueN = this.palette.n[3 - n[index]];
    return {
      r: this.palette.r[3 - r[index]] * valueN / 0xff,
      g: this.palette.g[3 - g[index]] * valueN / 0xff,
      b: this.palette.b[3 - b[index]] * valueN / 0xff,
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
