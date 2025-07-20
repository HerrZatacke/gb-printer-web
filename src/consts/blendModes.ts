import { BlendMode } from 'gb-image-decoder';

export interface BlendModeLabel {
  id: BlendMode,
  translationKey: string,
}

export const blendModeLabels: BlendModeLabel[] = [
  {
    id: BlendMode.NORMAL,
    translationKey: 'blendModes.normal',
  },
  {
    id: BlendMode.NORMAL_S,
    translationKey: 'blendModes.normalS',
  },
  {
    id: BlendMode.LIGHTEN,
    translationKey: 'blendModes.lighten',
  },
  {
    id: BlendMode.SCREEN,
    translationKey: 'blendModes.screen',
  },
  {
    id: BlendMode.DODGE,
    translationKey: 'blendModes.dodge',
  },
  {
    id: BlendMode.ADDITION,
    translationKey: 'blendModes.addition',
  },
  {
    id: BlendMode.DARKEN,
    translationKey: 'blendModes.darken',
  },
  {
    id: BlendMode.MULTIPLY,
    translationKey: 'blendModes.multiply',
  },
  {
    id: BlendMode.BURN,
    translationKey: 'blendModes.burn',
  },
  {
    id: BlendMode.OVERLAY,
    translationKey: 'blendModes.overlay',
  },
  {
    id: BlendMode.SOFTLIGHT,
    translationKey: 'blendModes.softLight',
  },
  {
    id: BlendMode.HARDLIGHT,
    translationKey: 'blendModes.hardLight',
  },
  {
    id: BlendMode.DIFFERENCE,
    translationKey: 'blendModes.difference',
  },
  {
    id: BlendMode.EXCLUSION,
    translationKey: 'blendModes.exclusion',
  },
];
