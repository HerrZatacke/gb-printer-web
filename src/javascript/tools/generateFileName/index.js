import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dateFormat } from '../values';

const dateFormatFilename = 'YYYYMMDD-HHmmss';

dayjs.extend(customParseFormat);

const rgbnPaletteName = ({ r, g, b, n }) => {

  const hex = (val) => (val.toString(16)).padStart(2, '0');

  return (
    [
      r.map(hex).join(''),
      g.map(hex).join(''),
      b.map(hex).join(''),
      n.map(hex).join(''),
    ].join('')
  );
};

const generateFileName = (image, palette, exportScaleFactor = false) => {

  const date = dayjs(image.created, dateFormat).format(dateFormatFilename);

  const paletteName = palette.shortName || rgbnPaletteName(palette);

  return [
    date,
    (image.index || 0).toString(10).padStart(4, '0'),
    image.title || null,
    exportScaleFactor ? `${exportScaleFactor}x` : null,
    paletteName,
  ]
    .filter(Boolean)
    .join('-');
};

export default generateFileName;
