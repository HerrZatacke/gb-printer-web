import Decoder from '../Decoder';
import { blendModeFunctions, blendModeKeys } from './blendModes';

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
      n: n ? super.decodeTile(n) : null, // neutral image not neccesarily required
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

    return this.blendColors({
      r: r[index],
      g: g[index],
      b: b[index],
      n: n ? n[index] : false, // 'false' is required for blending if no neutral layer exists
    });
  }

  blendColors({ r, g, b, n }) {
    const RGBValues = {
      r: this.palette.r[3 - r],
      g: this.palette.g[3 - g],
      b: this.palette.b[3 - b],
    };

    // no blending if neutral layer does not exist
    if (n === false) {
      return RGBValues;
    }

    const blendMode = this.palette.blendmode || blendModeKeys.MULTIPLY;

    if (!blendModeFunctions[blendMode]) {
      return RGBValues;
    }

    const callBlendFunction = (value, neutral) => (
      Math.max(
        0,
        Math.min(
          1,
          blendModeFunctions[blendMode](value / 255, neutral / 255),
        ),
      ) * 255
    );

    return {
      r: callBlendFunction(this.palette.r[3 - r], this.palette.r[3 - n]),
      g: callBlendFunction(this.palette.r[3 - g], this.palette.r[3 - n]),
      b: callBlendFunction(this.palette.r[3 - b], this.palette.r[3 - n]),
    };
  }

  // RGBN image has always a height of 144
  getHeight() {
    return 144;
  }

  static rgbnTiles([r, g, b, n]) {
    return [...Array(360)].map((_, i) => ({
      r: r?.[i],
      g: g?.[i],
      b: b?.[i],
      n: n?.[i],
    }));
  }
}

export default RGBNDecoder;
