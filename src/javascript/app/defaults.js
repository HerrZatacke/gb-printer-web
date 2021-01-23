const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormatInput = 'YYYY-MM-DDTHH:mm';
const dateFormatFilename = 'YYYYMMDD-HHmmss';
const dateFormatReadable = 'DD.MM.YYYY HH:mm';

const defaultGreys = [0x00, 0x55, 0xaa, 0xff];

const defaultPalette = {
  r: defaultGreys.slice(),
  g: defaultGreys.slice(),
  b: defaultGreys.slice(),
  n: defaultGreys.slice(),
};

export {
  dateFormat,
  dateFormatInput,
  dateFormatFilename,
  dateFormatReadable,
  defaultPalette,
  defaultGreys,
};
