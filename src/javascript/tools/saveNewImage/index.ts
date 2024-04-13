import dayjs from 'dayjs';
import { save } from '../storage';
import { dateFormat } from '../../app/defaults';
import { MonochromeImage } from '../../../types/Image';

interface ImageRawData {
  lines: string[],
  filename: string,
}

const saveNewImage = async ({
  lines,
  filename,
  palette,
  frame = null,
  tags = [],
  meta,
  created = dayjs().format(dateFormat),
}: MonochromeImage & ImageRawData): Promise<MonochromeImage> => {
  const dataHash = await save(lines);

  return {
    hash: dataHash,
    created,
    title: filename || '',
    lines: lines.length,
    tags,
    palette,
    frame,
    meta,
  };
};

export default saveNewImage;
