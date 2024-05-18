/* eslint-disable no-unused-vars */
export enum BlendMode {

  NORMAL = 'normal', // skip N-Layer
  NORMAL_S = 'normal_s', // "source-over"

  // Lighten Layer Modes
  LIGHTEN = 'lighten', // Retains the lightest pixels of both layers.
  SCREEN = 'screen', // The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)
  DODGE = 'dodge', // Divides the bottom layer by the inverted top layer.
  // DODGE_S = 'dodge_s',
  ADDITION = 'addition', // "lighter"


  // Darken Layer Modes
  DARKEN = 'darken', // Retains the darkest pixels of both layers.
  MULTIPLY = 'multiply', // The pixels of the top layer are multiplied with the corresponding pixels of the bottom layer. A darker picture is the result.
  BURN = 'burn', // Divides the inverted bottom layer by the top layer, and then inverts the result.
  // BURN_S = 'burn_s',
  OVERLAY = 'overlay', // A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.
  SOFTLIGHT = 'softlight', // "soft-light" // A softer version of hard-light. Pure black or white does not result in pure black or white.
  // SOFTLIGHT_S = 'softlight_s',
  HARDLIGHT = 'hardlight', // "hard-light" // Like overlay, a combination of multiply and screen — but instead with the top layer and bottom layer swapped.

  // inversion modes
  DIFFERENCE = 'difference', // Subtracts the bottom layer from the top layer — or the other way round — to always get a positive value.
  // SUBTRACT = 'subtract',
  // SUBTRACT_S = 'subtract_s',
  // GRAIN_EXTRACT = 'grainextract',
  // GRAIN_EXTRACT_S = 'grainextract_s',
  // GRAIN_MERGE = 'grainmerge',
  // DIVIDE = 'divide',
  // DIVIDE_S = 'divide_s',
}


// "exclusion" // Like difference, but with lower contrast.

// "hue" // Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.
// "saturation" // Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.
// "color" // Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.
// "luminosity" // Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.

export const blendModeNewName = (oldName?: BlendMode): GlobalCompositeOperation => {
  switch (oldName) {
    case BlendMode.NORMAL: return 'source-over';
    case BlendMode.NORMAL_S: return 'source-over';
    case BlendMode.LIGHTEN: return 'lighten';
    case BlendMode.SCREEN: return 'screen';
    case BlendMode.DODGE: return 'color-dodge';
    case BlendMode.ADDITION: return 'lighter';
    case BlendMode.DARKEN: return 'darken';
    case BlendMode.MULTIPLY: return 'multiply';
    case BlendMode.BURN: return 'color-burn';
    case BlendMode.OVERLAY: return 'overlay';
    case BlendMode.SOFTLIGHT: return 'soft-light';
    case BlendMode.HARDLIGHT: return 'hard-light';
    case BlendMode.DIFFERENCE: return 'difference';
    default: return 'multiply';
  }
};


// export type BlendModeFunction = (colorValue: number, neutralValue: number) => number;

// export const blendModeFunctions: Record<BlendMode, BlendModeFunction> = {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   [BlendMode.NORMAL]: (i, m) => (
//     i
//   ),
//
//   [BlendMode.LIGHTEN]: (i, m) => (
//     Math.max(m, i)
//   ),
//
//   [BlendMode.SCREEN]: (i, m) => (
//     1 - ((1 - m) * (1 - i))
//   ),
//   [BlendMode.DODGE]: (i, m) => (
//     i / (1 - m)
//   ),
//   [BlendMode.ADDITION]: (i, m) => (
//     m + i
//   ),
//   [BlendMode.DARKEN]: (i, m) => (
//     Math.min(m, i)
//   ),
//   [BlendMode.MULTIPLY]: (i, m) => (
//     m * i
//   ),
//   [BlendMode.BURN]: (i, m) => (
//     1 - ((1 - i) / (m))
//     // to match GIMP exactly:
//     // 1 - ((1 - i) / (0.0039 + m))
//   ),
//   [BlendMode.OVERLAY]: (i, m) => (
//     i < 0.5 ? (
//       2 * i * m
//     ) : (
//       1 - (2 * (1 - m) * (1 - i))
//     )
//   ),
//   [BlendMode.SOFTLIGHT]: (i, m) => (
//     (
//       (1 - i) * blendModeFunctions[BlendMode.MULTIPLY](i, m)
//     ) + (
//       i * blendModeFunctions[BlendMode.SCREEN](i, m)
//     )
//   ),
//   [BlendMode.DIFFERENCE]: (i, m) => (
//     Math.abs(i - m)
//   ),
//   // [BlendMode.SUBTRACT]: (i, m) => (
//   //   i - m
//   // ),
//   // [BlendMode.GRAIN_EXTRACT]: (i, m) => (
//   //   i - m + 0.5
//   // ),
//   // [BlendMode.GRAIN_MERGE]: (i, m) => (
//   //   i + m - 0.5
//   // ),
//   // [BlendMode.DIVIDE]: (i, m) => (
//   //   i / m
//   // ),
//
//   // asymetrtic calls
//   [BlendMode.NORMAL_S]: (i, m) => (
//     blendModeFunctions[BlendMode.NORMAL](m, i)
//   ),
//   // [BlendMode.DODGE_S]: (i, m) => (
//   //   blendModeFunctions[BlendMode.DODGE](m, i)
//   // ),
//   // [BlendMode.BURN_S]: (i, m) => (
//   //   blendModeFunctions[BlendMode.BURN](m, i)
//   // ),
//   [BlendMode.HARDLIGHT]: (i, m) => (
//     blendModeFunctions[BlendMode.OVERLAY](m, i)
//   ),
//   // [BlendMode.SOFTLIGHT_S]: (i, m) => (
//   //   blendModeFunctions[BlendMode.SOFTLIGHT](m, i)
//   // ),
//   // [BlendMode.SUBTRACT_S]: (i, m) => (
//   //   blendModeFunctions[BlendMode.SUBTRACT](m, i)
//   // ),
//   // [BlendMode.GRAIN_EXTRACT_S]: (i, m) => (
//   //   blendModeFunctions[BlendMode.GRAIN_EXTRACT](m, i)
//   // ),
//   // [BlendMode.DIVIDE_S]: (i, m) => (
//   //   blendModeFunctions[BlendMode.DIVIDE](m, i)
//   // ),
// };


export interface BlendModeLabel {
  id: BlendMode,
  label: string,
}

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
  // {
  //   id: BlendMode.DODGE_S,
  //   label: 'Dodge ⇵',
  // },
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
  // {
  //   id: BlendMode.BURN_S,
  //   label: 'Burn ⇵',
  // },
  {
    id: BlendMode.OVERLAY,
    label: 'Overlay',
  },
  {
    id: BlendMode.SOFTLIGHT,
    label: 'Soft light',
  },
  // {
  //   id: BlendMode.SOFTLIGHT_S,
  //   label: 'Soft light ⇵',
  // },
  {
    id: BlendMode.HARDLIGHT,
    label: 'Hard light',
  },

  // inversion modes
  {
    id: BlendMode.DIFFERENCE,
    label: 'Difference',
  },
  // {
  //   id: BlendMode.SUBTRACT,
  //   label: 'Subtract',
  // },
  // {
  //   id: BlendMode.SUBTRACT_S,
  //   label: 'Subtract ⇵',
  // },
  // {
  //   id: BlendMode.GRAIN_EXTRACT,
  //   label: 'Grain extract',
  // },
  // {
  //   id: BlendMode.GRAIN_EXTRACT_S,
  //   label: 'Grain extract ⇵',
  // },
  // {
  //   id: BlendMode.GRAIN_MERGE,
  //   label: 'Grain merge',
  // },
  // {
  //   id: BlendMode.DIVIDE,
  //   label: 'Divide',
  // },
  // {
  //   id: BlendMode.DIVIDE_S,
  //   label: 'Divide ⇵',
  // },
];

