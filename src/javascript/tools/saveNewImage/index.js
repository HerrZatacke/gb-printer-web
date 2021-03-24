import dayjs from 'dayjs';
import { save } from '../storage';
import { dateFormat } from '../../app/defaults';

const saveNewImage = ({ lines, filename, palette, dispatch }) => {
  save(lines)
    .then((dataHash) => {
      const image = {
        hash: dataHash,
        created: dayjs().format(dateFormat),
        title: filename || '',
        lines: lines.length,
        tags: [],
        palette,
      };

      dispatch({
        type: 'ADD_IMAGE',
        payload: image,
      });
    });
};

export default saveNewImage;
