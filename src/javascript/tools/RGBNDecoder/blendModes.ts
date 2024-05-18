/* eslint-disable no-unused-vars */
export enum BlendMode {
  NORMAL = 'normal', // skip N-Layer
  NORMAL_S = 'normal_s', // This is the default setting and draws new shapes on top of the existing canvas content.
  LIGHTEN = 'lighten', // Retains the lightest pixels of both layers.
  SCREEN = 'screen', // The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)
  DODGE = 'dodge', // Divides the bottom layer by the inverted top layer.
  ADDITION = 'addition', // Where both shapes overlap, the color is determined by adding color values.
  DARKEN = 'darken', // Retains the darkest pixels of both layers.
  MULTIPLY = 'multiply', // The pixels of the top layer are multiplied with the corresponding pixels of the bottom layer. A darker picture is the result.
  BURN = 'burn', // Divides the inverted bottom layer by the top layer, and then inverts the result.
  OVERLAY = 'overlay', // A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.
  SOFTLIGHT = 'softlight', // A softer version of hard-light. Pure black or white does not result in pure black or white.
  HARDLIGHT = 'hardlight', // Like overlay, a combination of multiply and screen — but instead with the top layer and bottom layer swapped.
  DIFFERENCE = 'difference', // Subtracts the bottom layer from the top layer — or the other way round — to always get a positive value.
  EXCLUSION = 'exclusion', // Like difference, but with lower contrast.
}

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
    case BlendMode.EXCLUSION: return 'exclusion';
    default: return 'multiply';
  }
};

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
  {
    id: BlendMode.LIGHTEN,
    label: 'Lighten',
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
    id: BlendMode.ADDITION,
    label: 'Addition',
  },
  {
    id: BlendMode.DARKEN,
    label: 'Darken',
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
    id: BlendMode.OVERLAY,
    label: 'Overlay',
  },
  {
    id: BlendMode.SOFTLIGHT,
    label: 'Soft light',
  },
  {
    id: BlendMode.HARDLIGHT,
    label: 'Hard light',
  },
  {
    id: BlendMode.DIFFERENCE,
    label: 'Difference',
  },
  {
    id: BlendMode.EXCLUSION,
    label: 'Exclusion',
  },
];

