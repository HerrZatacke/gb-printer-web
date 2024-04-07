/* eslint-disable no-unused-vars */
export enum BlendMode {

  NORMAL = 'normal',
  NORMAL_S = 'normal_s',

  // Lighten Layer Modes
  LIGHTEN = 'lighten',
  SCREEN = 'screen',
  DODGE = 'dodge',
  DODGE_S = 'dodge_s',
  ADDITION = 'addition',


  // Darken Layer Modes
  DARKEN = 'darken',
  MULTIPLY = 'multiply',
  BURN = 'burn',
  BURN_S = 'burn_s',
  OVERLAY = 'overlay',
  SOFTLIGHT = 'softlight',
  SOFTLIGHT_S = 'softlight_s',
  HARDLIGHT = 'hardlight',

  // inversion modes
  DIFFERENCE = 'difference',
  SUBTRACT = 'subtract',
  SUBTRACT_S = 'subtract_s',
  GRAIN_EXTRACT = 'grainextract',
  GRAIN_EXTRACT_S = 'grainextract_s',
  GRAIN_MERGE = 'grainmerge',
  DIVIDE = 'divide',
  DIVIDE_S = 'divide_s',
}

export type BlendModeFunction = (colorValue: number, neutralValue: number) => number;

export interface BlendModeLabel {
  id: BlendMode,
  label: string,
}

export const blendModeFunctions: Record<BlendMode, BlendModeFunction> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [BlendMode.NORMAL]: (i, m) => (
    i
  ),

  [BlendMode.LIGHTEN]: (i, m) => (
    Math.max(m, i)
  ),

  [BlendMode.SCREEN]: (i, m) => (
    1 - ((1 - m) * (1 - i))
  ),
  [BlendMode.DODGE]: (i, m) => (
    i / (1 - m)
  ),
  [BlendMode.ADDITION]: (i, m) => (
    m + i
  ),
  [BlendMode.DARKEN]: (i, m) => (
    Math.min(m, i)
  ),
  [BlendMode.MULTIPLY]: (i, m) => (
    m * i
  ),
  [BlendMode.BURN]: (i, m) => (
    1 - ((1 - i) / (m))
    // to match GIMP exactly:
    // 1 - ((1 - i) / (0.0039 + m))
  ),
  [BlendMode.OVERLAY]: (i, m) => (
    i < 0.5 ? (
      2 * i * m
    ) : (
      1 - (2 * (1 - m) * (1 - i))
    )
  ),
  [BlendMode.SOFTLIGHT]: (i, m) => (
    (
      (1 - i) * blendModeFunctions[BlendMode.MULTIPLY](i, m)
    ) + (
      i * blendModeFunctions[BlendMode.SCREEN](i, m)
    )
  ),
  [BlendMode.DIFFERENCE]: (i, m) => (
    Math.abs(i - m)
  ),
  [BlendMode.SUBTRACT]: (i, m) => (
    i - m
  ),
  [BlendMode.GRAIN_EXTRACT]: (i, m) => (
    i - m + 0.5
  ),
  [BlendMode.GRAIN_MERGE]: (i, m) => (
    i + m - 0.5
  ),
  [BlendMode.DIVIDE]: (i, m) => (
    i / m
  ),

  // asymetrtic calls
  [BlendMode.NORMAL_S]: (i, m) => (
    blendModeFunctions[BlendMode.NORMAL](m, i)
  ),
  [BlendMode.DODGE_S]: (i, m) => (
    blendModeFunctions[BlendMode.DODGE](m, i)
  ),
  [BlendMode.BURN_S]: (i, m) => (
    blendModeFunctions[BlendMode.BURN](m, i)
  ),
  [BlendMode.HARDLIGHT]: (i, m) => (
    blendModeFunctions[BlendMode.OVERLAY](m, i)
  ),
  [BlendMode.SOFTLIGHT_S]: (i, m) => (
    blendModeFunctions[BlendMode.SOFTLIGHT](m, i)
  ),
  [BlendMode.SUBTRACT_S]: (i, m) => (
    blendModeFunctions[BlendMode.SUBTRACT](m, i)
  ),
  [BlendMode.GRAIN_EXTRACT_S]: (i, m) => (
    blendModeFunctions[BlendMode.GRAIN_EXTRACT](m, i)
  ),
  [BlendMode.DIVIDE_S]: (i, m) => (
    blendModeFunctions[BlendMode.DIVIDE](m, i)
  ),
};

export const blendModeLabels: BlendModeLabel[] = [
  {
    id: BlendMode.NORMAL,
    label: 'Normal (ignore neutral layer)',
  },
  {
    id: BlendMode.NORMAL_S,
    label: 'Normal ⇵ (only neutral layer)',
  },

  // Lighten Layer Modes
  {
    id: BlendMode.LIGHTEN,
    label: 'Lighten only',
  },
  {
    id: BlendMode.SCREEN,
    label: 'Screen',
  },
  {
    id: BlendMode.DODGE,
    label: 'Dodge',
  },
  {
    id: BlendMode.DODGE_S,
    label: 'Dodge ⇵',
  },
  {
    id: BlendMode.ADDITION,
    label: 'Addition',
  },

  // Darken Layer Modes
  {
    id: BlendMode.DARKEN,
    label: 'Darken only',
  },
  {
    id: BlendMode.MULTIPLY,
    label: 'Multiply',
  },
  {
    id: BlendMode.BURN,
    label: 'Burn',
  },
  {
    id: BlendMode.BURN_S,
    label: 'Burn ⇵',
  },
  {
    id: BlendMode.OVERLAY,
    label: 'Overlay',
  },
  {
    id: BlendMode.SOFTLIGHT,
    label: 'Soft light',
  },
  {
    id: BlendMode.SOFTLIGHT_S,
    label: 'Soft light ⇵',
  },
  {
    id: BlendMode.HARDLIGHT,
    label: 'Hard light',
  },

  // inversion modes
  {
    id: BlendMode.DIFFERENCE,
    label: 'Difference',
  },
  {
    id: BlendMode.SUBTRACT,
    label: 'Subtract',
  },
  {
    id: BlendMode.SUBTRACT_S,
    label: 'Subtract ⇵',
  },
  {
    id: BlendMode.GRAIN_EXTRACT,
    label: 'Grain extract',
  },
  {
    id: BlendMode.GRAIN_EXTRACT_S,
    label: 'Grain extract ⇵',
  },
  {
    id: BlendMode.GRAIN_MERGE,
    label: 'Grain merge',
  },
  {
    id: BlendMode.DIVIDE,
    label: 'Divide',
  },
  {
    id: BlendMode.DIVIDE_S,
    label: 'Divide ⇵',
  },
];

