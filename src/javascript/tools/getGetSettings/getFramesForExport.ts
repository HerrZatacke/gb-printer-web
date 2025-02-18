import type { Frame } from '../../../types/Frame';
import type { ExportTypes } from '../../consts/exportTypes';

const getFramesForExport = (
  what: ExportTypes.CURRENT_FRAMEGROUP | ExportTypes.FRAMES,
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
