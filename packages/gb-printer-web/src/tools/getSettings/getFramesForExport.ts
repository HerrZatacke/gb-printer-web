import { type Frame } from 'gb-printer-schemas';
import { type ExportTypes } from '@/consts/exportTypes';

const getFramesForExport = (
  what: typeof ExportTypes.CURRENT_FRAMEGROUP | typeof ExportTypes.FRAMES,
  frames: Frame[],
  frameSetID = '',
): Frame[] => {

  switch (what) {
    case 'frames':
      // export all frames
      return frames;
    case 'current_framegroup':
      // export selected only
      return frames
        .filter(({ id }) => id.startsWith(frameSetID));
    default:
      return [];
  }
};

export default getFramesForExport;
