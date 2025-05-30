import dayjs from 'dayjs';
import { dateFormat } from '@/consts/defaults';
import { save } from '@/tools/storage';
import type { MonochromeImage } from '@/types/Image';

interface ImageRawData extends Pick<MonochromeImage, 'palette' | 'frame' | 'tags' | 'meta' | 'created'> {
  lines: string[],
  filename: string,
}


const saveNewImage = async ({
  lines,
  filename,
  palette,
  frame,
  tags = [],
  meta,
  created = dayjs().format(dateFormat),
}: ImageRawData): Promise<MonochromeImage> => {
  const dataHash = await save(lines);

  return {
    hash: dataHash,
    created,
    title: filename || '',
    lines: lines.length,
    tags,
    palette,
    framePalette: palette,
    invertFramePalette: false,
    invertPalette: false,
    frame,
    meta,
  };
};

export default saveNewImage;
