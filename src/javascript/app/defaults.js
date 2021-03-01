const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormatInput = 'YYYY-MM-DDTHH:mm';
const dateFormatFilename = 'YYYYMMDD-HHmmss';
const dateFormatReadable = 'DD.MM.YYYY HH:mm';

const defaultGreys = [0x00, 0x55, 0xaa, 0xff];

const initLine = '!{"command":"INIT"}';
const moreLine = '!{"command":"DATA", "compressed":0, "more":1}';
const finalLine = '!{"command":"DATA","compressed":0,"more":0}';
const terminatorLine = '!{"command":"PRNT","sheets":1,"margin_upper":1,"margin_lower":3,"pallet":228,"density":64 }';

const defaultRGBNPalette = {
  r: defaultGreys.slice(),
  g: defaultGreys.slice(),
  b: defaultGreys.slice(),
  n: defaultGreys.slice(),
};

const missingGreyPalette = {
  shortName: '-',
  name: 'Missing Palette',
  palette: ['#aaaaaa', '#999999', '#888888', '#777777'],
};

export {
  dateFormat,
  dateFormatInput,
  dateFormatFilename,
  dateFormatReadable,
  defaultRGBNPalette,
  missingGreyPalette,
  defaultGreys,
  initLine,
  moreLine,
  finalLine,
  terminatorLine,
};
