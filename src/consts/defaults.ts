import { BlendMode } from 'gb-image-decoder';
import type { Palette } from '../../types/Palette';

const dateFormat = 'YYYY-MM-DD HH:mm:ss:SSS';
const dateFormatSeconds = 'YYYY-MM-DD HH:mm:ss';
const dateFormatInput = 'YYYY-MM-DD';
const timeFormatInput = 'HH:mm';
const dateFormatFilename = 'YYYYMMDD-HHmmss';

const defaultGreys = [0x00, 0x55, 0xaa, 0xff];

const initLine = '{"command":"INIT"}';
const moreLine = '{"command":"DATA", "compressed":0, "more":1}';
const finalLine = '{"command":"DATA","compressed":0,"more":0}';
const terminatorLine = '{"command":"PRNT","sheets":1,"margin_upper":1,"margin_lower":3,"pallet":228,"density":64 }';

const defaultRGBNPalette = {
  r: defaultGreys.slice(),
  g: defaultGreys.slice(),
  b: defaultGreys.slice(),
  n: defaultGreys.slice(),
  blend: BlendMode.MULTIPLY,
};

const missingGreyPalette: Palette = {
  shortName: '-',
  name: 'Missing Palette',
  palette: ['#aaaaaa', '#999999', '#888888', '#777777'],
  isPredefined: true,
  origin: 'technical',
};

export {
  dateFormat,
  dateFormatSeconds,
  dateFormatInput,
  timeFormatInput,
  dateFormatFilename,
  defaultRGBNPalette,
  missingGreyPalette,
  defaultGreys,
  initLine,
  moreLine,
  finalLine,
  terminatorLine,
};
