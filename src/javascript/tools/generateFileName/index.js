import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dateFormat } from '../values';

const dateFormatFilename = 'YYYYMMDD-HHmmss';

dayjs.extend(customParseFormat);

const generateFileName = (image, { shortName }, exportScaleFactor = false) => {

  const date = dayjs(image.created, dateFormat).format(dateFormatFilename);

  return [
    date,
    (image.index || 0).toString(10).padStart(4, '0'),
    image.title || null,
    exportScaleFactor ? `${exportScaleFactor}x` : null,
    shortName,
  ]
    .filter(Boolean)
    .join('-');
};

export default generateFileName;
