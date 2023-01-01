import dayjs from 'dayjs';
import { save } from '../storage';
import { dateFormat } from '../../app/defaults';

const saveNewImage = ({ lines, filename, palette, frame = null, tags = [], meta }) => (
  save(lines)
    .then((dataHash) => ({
      hash: dataHash,
      created: dayjs().format(dateFormat),
      title: filename || '',
      lines: lines.length,
      tags,
      palette,
      frame,
      meta,
    }))
);

export default saveNewImage;
