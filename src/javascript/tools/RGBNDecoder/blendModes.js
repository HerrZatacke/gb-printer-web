/* eslint-disable no-unused-vars */
const blendModeKeys = {

  // Lighten Layer Modes
  LIGHTEN: 'lighten',
  SCREEN: 'screen',
  DODGE: 'dodge',
  DODGE_S: 'dodge_s',
  ADDITION: 'add',


  // Darken Layer Modes
  DARKEN: 'darken',
  MULTIPLY: 'multiply',
  BURN: 'burn',
  OVERLAY: 'overlay',
  SOFTLIGHT: 'softlight',
  HARDLIGHT: 'hardlight',

  // inversion modes
  DIFFERENCE: 'difference',
  SUBTRACT: 'subtract',
  GRAIN_EXTRACT: 'grainextract',
  GRAIN_MERGE: 'grainmerge',
  DIVIDE: 'divide',

  // HSV Components Layer Modes

  // LCh Components Layer Modes
};

const blendModeFunctions = {
  [blendModeKeys.LIGHTEN]: (m, i) => (
    Math.max(m, i)
  ),

  [blendModeKeys.SCREEN]: (m, i) => (
    1 - ((1 - m) * (1 - i))
  ),
  [blendModeKeys.DODGE]: (m, i) => (
    m / (1 - i)
  ),
  [blendModeKeys.DODGE_S]: (m, i) => (
    i / (1 - m)
  ),
  [blendModeKeys.ADDITION]: (m, i) => (m),
  [blendModeKeys.DARKEN]: (m, i) => (m),
  [blendModeKeys.MULTIPLY]: (m, i) => (
    m * i
  ),
  [blendModeKeys.BURN]: (m, i) => (m),
  [blendModeKeys.OVERLAY]: (m, i) => (m),
  [blendModeKeys.SOFTLIGHT]: (m, i) => (m),
  [blendModeKeys.HARDLIGHT]: (m, i) => (m),
  [blendModeKeys.DIFFERENCE]: (m, i) => (m),
  [blendModeKeys.SUBTRACT]: (m, i) => (m),
  [blendModeKeys.GRAIN_EXTRACT]: (m, i) => (m),
  [blendModeKeys.GRAIN_MERGE]: (m, i) => (m),
  [blendModeKeys.DIVIDE]: (m, i) => (m),
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
  [blendModeKeys.OVERLAY]: 'Overlay',
  [blendModeKeys.SOFTLIGHT]: 'Soft light',
  [blendModeKeys.HARDLIGHT]: 'Hard light',

  // inversion modes
  [blendModeKeys.DIFFERENCE]: 'Difference',
  [blendModeKeys.SUBTRACT]: 'Subtract',
  [blendModeKeys.GRAIN_EXTRACT]: 'Grain extract',
  [blendModeKeys.GRAIN_MERGE]: 'Grain merge',
  [blendModeKeys.DIVIDE]: 'Divide',

};


export {
  blendModeKeys,
  blendModeFunctions,
  blendModeLabels,
};
