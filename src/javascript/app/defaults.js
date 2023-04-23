import { blendModeKeys } from '../tools/RGBNDecoder/blendModes';

const dateFormat = 'YYYY-MM-DD HH:mm:ss:SSS';
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
  blend: blendModeKeys.MULTIPLY,
};

const missingGreyPalette = {
  shortName: '-',
  name: 'Missing Palette',
  palette: ['#aaaaaa', '#999999', '#888888', '#777777'],
};

export {
  dateFormat,
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
