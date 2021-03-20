/* eslint-disable no-unused-vars */
const blendModeKeys = {

  // Lighten Layer Modes
  LIGHTEN: 'lighten',
  SCREEN: 'screen',
  DODGE: 'dodge',
  DODGE_S: 'dodge_s',
  ADDITION: 'addition',


  // Darken Layer Modes
  DARKEN: 'darken',
  MULTIPLY: 'multiply',
  BURN: 'burn',
  BURN_S: 'burn_s',
  OVERLAY: 'overlay',
  SOFTLIGHT: 'softlight',
  SOFTLIGHT_S: 'softlight_s',
  HARDLIGHT: 'hardlight',

  // inversion modes
  DIFFERENCE: 'difference',
  SUBTRACT: 'subtract',
  SUBTRACT_S: 'subtract_s',
  GRAIN_EXTRACT: 'grainextract',
  GRAIN_EXTRACT_S: 'grainextract_s',
  GRAIN_MERGE: 'grainmerge',

  // HSV Components Layer Modes

  // LCh Components Layer Modes
};

const blendModeFunctions = {
  [blendModeKeys.LIGHTEN]: (i, m) => (
    Math.max(m, i)
  ),

  [blendModeKeys.SCREEN]: (i, m) => (
    1 - ((1 - m) * (1 - i))
  ),
  [blendModeKeys.DODGE]: (i, m) => (
    i / (1 - m)
  ),
  [blendModeKeys.ADDITION]: (i, m) => (
    m + i
  ),
  [blendModeKeys.DARKEN]: (i, m) => (
    Math.min(m, i)
  ),
  [blendModeKeys.MULTIPLY]: (i, m) => (
    m * i
  ),
  [blendModeKeys.BURN]: (i, m) => (
    1 - ((1 - i) / (m))
    // to match GIMP exactly:
    // 1 - ((1 - i) / (0.0039 + m))
  ),
  [blendModeKeys.OVERLAY]: (i, m) => (
    i < 0.5 ? (
      2 * i * m
    ) : (
      1 - (2 * (1 - m) * (1 - i))
    )
  ),
  [blendModeKeys.SOFTLIGHT]: (i, m) => (
    (
      (1 - i) * blendModeFunctions[blendModeKeys.MULTIPLY](i, m)
    ) + (
      i * blendModeFunctions[blendModeKeys.SCREEN](i, m)
    )
  ),
  [blendModeKeys.DIFFERENCE]: (i, m) => (
    Math.abs(i - m)
  ),
  [blendModeKeys.SUBTRACT]: (i, m) => (
    i - m
  ),
  [blendModeKeys.GRAIN_EXTRACT]: (i, m) => (
    i - m + 0.5
  ),
  [blendModeKeys.GRAIN_MERGE]: (i, m) => (
    i + m - 0.5
  ),

  // asymetrtic calls
  [blendModeKeys.DODGE_S]: (i, m) => (
    blendModeFunctions[blendModeKeys.DODGE](m, i)
  ),
  [blendModeKeys.BURN_S]: (i, m) => (
    blendModeFunctions[blendModeKeys.BURN](m, i)
  ),
  [blendModeKeys.HARDLIGHT]: (i, m) => (
    blendModeFunctions[blendModeKeys.OVERLAY](m, i)
  ),
  [blendModeKeys.SOFTLIGHT_S]: (i, m) => (
    blendModeFunctions[blendModeKeys.SOFTLIGHT](m, i)
  ),
  [blendModeKeys.SUBTRACT_S]: (i, m) => (
    blendModeFunctions[blendModeKeys.SUBTRACT](m, i)
  ),
  [blendModeKeys.GRAIN_EXTRACT_S]: (i, m) => (
    blendModeFunctions[blendModeKeys.GRAIN_EXTRACT](m, i)
  ),
};

const blendModeLabels = {

  // Lighten Layer Modes
  [blendModeKeys.LIGHTEN]: 'Lighten only',
  [blendModeKeys.SCREEN]: 'Screen',
  [blendModeKeys.DODGE]: 'Dodge',
  [blendModeKeys.DODGE_S]: 'Dodge ⇵',
  [blendModeKeys.ADDITION]: 'Addition',

  // Darken Layer Modes
  [blendModeKeys.DARKEN]: 'Darken only',
  [blendModeKeys.MULTIPLY]: 'Multiply',
  [blendModeKeys.BURN]: 'Burn',
  [blendModeKeys.BURN_S]: 'Burn ⇵',
  [blendModeKeys.OVERLAY]: 'Overlay',
  [blendModeKeys.SOFTLIGHT]: 'Soft light',
  [blendModeKeys.SOFTLIGHT_S]: 'Soft light ⇵',
  [blendModeKeys.HARDLIGHT]: 'Hard light',

  // inversion modes
  [blendModeKeys.DIFFERENCE]: 'Difference',
  [blendModeKeys.SUBTRACT]: 'Subtract',
  [blendModeKeys.SUBTRACT_S]: 'Subtract ⇵',
  [blendModeKeys.GRAIN_EXTRACT]: 'Grain extract',
  [blendModeKeys.GRAIN_EXTRACT_S]: 'Grain extract ⇵',
  [blendModeKeys.GRAIN_MERGE]: 'Grain merge',

};


export {
  blendModeKeys,
  blendModeFunctions,
  blendModeLabels,
};
