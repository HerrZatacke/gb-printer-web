import { BlendMode } from 'gb-image-decoder';
import type { Palette } from '@/types/Palette';

export const defaultGreys = [0x00, 0x55, 0xaa, 0xff];

export const initLine = '{"command":"INIT"}';
export const moreLine = '{"command":"DATA", "compressed":0, "more":1}';
export const finalLine = '{"command":"DATA","compressed":0,"more":0}';
export const terminatorLine = '{"command":"PRNT","sheets":1,"margin_upper":1,"margin_lower":3,"pallet":228,"density":64 }';

export const defaultRGBNPalette = {
  r: defaultGreys.slice(),
  g: defaultGreys.slice(),
  b: defaultGreys.slice(),
  n: defaultGreys.slice(),
  blend: BlendMode.MULTIPLY,
};

export const missingGreyPalette: Palette = {
  shortName: '-',
  name: 'Missing Palette',
  palette: ['#aaaaaa', '#999999', '#888888', '#777777'],
  isPredefined: true,
  origin: 'technical',
};
