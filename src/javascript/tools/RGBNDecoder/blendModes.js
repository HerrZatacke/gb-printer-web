/* eslint-disable no-unused-vars */
const blendModeKeys = {

  NORMAL: 'normal',
  NORMAL_S: 'normal_s',

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
  DIVIDE: 'divide',
  DIVIDE_S: 'divide_s',

  // HSV Components Layer Modes

  // LCh Components Layer Modes
};

const blendModeFunctions = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [blendModeKeys.NORMAL]: (i, m) => (
    i
  ),

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
  [blendModeKeys.DIVIDE]: (i, m) => (
    i / m
  ),

  // asymetrtic calls
  [blendModeKeys.NORMAL_S]: (i, m) => (
    blendModeFunctions[blendModeKeys.NORMAL](m, i)
  ),
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
  [blendModeKeys.DIVIDE_S]: (i, m) => (
    blendModeFunctions[blendModeKeys.DIVIDE](m, i)
  ),
};

const blendModeLabels = [
  {
    id: blendModeKeys.NORMAL,
    label: 'Normal (ignore neutral layer)',
  },
  {
    id: blendModeKeys.NORMAL_S,
    label: 'Normal ⇵ (only neutral layer)',
  },

  // Lighten Layer Modes
  {
    id: blendModeKeys.LIGHTEN,
    label: 'Lighten only',
  },
  {
    id: blendModeKeys.SCREEN,
    label: 'Screen',
  },
  {
    id: blendModeKeys.DODGE,
    label: 'Dodge',
  },
  {
    id: blendModeKeys.DODGE_S,
    label: 'Dodge ⇵',
  },
  {
    id: blendModeKeys.ADDITION,
    label: 'Addition',
  },

  // Darken Layer Modes
  {
    id: blendModeKeys.DARKEN,
    label: 'Darken only',
  },
  {
    id: blendModeKeys.MULTIPLY,
    label: 'Multiply',
  },
  {
    id: blendModeKeys.BURN,
    label: 'Burn',
  },
  {
    id: blendModeKeys.BURN_S,
    label: 'Burn ⇵',
  },
  {
    id: blendModeKeys.OVERLAY,
    label: 'Overlay',
  },
  {
    id: blendModeKeys.SOFTLIGHT,
    label: 'Soft light',
  },
  {
    id: blendModeKeys.SOFTLIGHT_S,
    label: 'Soft light ⇵',
  },
  {
    id: blendModeKeys.HARDLIGHT,
    label: 'Hard light',
  },

  // inversion modes
  {
    id: blendModeKeys.DIFFERENCE,
    label: 'Difference',
  },
  {
    id: blendModeKeys.SUBTRACT,
    label: 'Subtract',
  },
  {
    id: blendModeKeys.SUBTRACT_S,
    label: 'Subtract ⇵',
  },
  {
    id: blendModeKeys.GRAIN_EXTRACT,
    label: 'Grain extract',
  },
  {
    id: blendModeKeys.GRAIN_EXTRACT_S,
    label: 'Grain extract ⇵',
  },
  {
    id: blendModeKeys.GRAIN_MERGE,
    label: 'Grain merge',
  },
  {
    id: blendModeKeys.DIVIDE,
    label: 'Divide',
  },
  {
    id: blendModeKeys.DIVIDE_S,
    label: 'Divide ⇵',
  },
];


export {
  blendModeKeys,
  blendModeFunctions,
  blendModeLabels,
};
