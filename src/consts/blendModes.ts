import { BlendMode } from 'gb-image-decoder';

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

