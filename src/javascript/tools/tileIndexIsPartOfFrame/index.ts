import { ExportFrameMode } from '../../consts/exportFrameModes';

const tileIndexIsPartOfFrame = (
  tileIndex: number,
  handleExportFrame: ExportFrameMode = ExportFrameMode.FRAMEMODE_KEEP,
): boolean => {

  const checkIndex = tileIndex - (handleExportFrame === ExportFrameMode.FRAMEMODE_KEEP ? 0 : 20);

  if (checkIndex < 40) {
    return true;
  }

  if (checkIndex >= 320) {
    return true;
  }

  switch (checkIndex % 20) {
    case 0:
    case 1:
    case 18:
    case 19:
      return true;
    default:
      return false;
  }
};

export default tileIndexIsPartOfFrame;
