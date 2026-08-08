import { toCreationDate } from 'gb-printer-schemas';
import { type MonochromeImage } from 'gb-printer-schemas';
import { save } from '@/tools/storage';

interface ImageRawData extends Pick<MonochromeImage, 'palette' | 'frame' | 'tags' | 'meta' | 'created'> {
  lines: string[];
  filename: string;
}


const saveNewImage = async ({
  lines,
  filename,
  palette,
  frame,
  tags = [],
  meta,
  created = toCreationDate(),
}: ImageRawData): Promise<MonochromeImage> => {
  const dataHash = await save(lines);

  return {
    type: 'mono',
    hash: dataHash,
    created,
    title: filename || '',
    lines: lines.length,
    tags,
    palette,
    framePalette: palette,
    invertFramePalette: false,
    invertPalette: false,
    lockFrame: false,
    frame,
    meta,
  };
};

export default saveNewImage;
