import { ExportFrameMode } from 'gb-image-decoder';

const exportFrameModes = [
  {
    id: ExportFrameMode.FRAMEMODE_KEEP,
    name: 'keepFrame',
  },
  {
    id: ExportFrameMode.FRAMEMODE_CROP,
    name: 'cropFrame',
  },
  {
    id: ExportFrameMode.FRAMEMODE_SQUARE_BLACK,
    name: 'squareBlack',
  },
  {
    id: ExportFrameMode.FRAMEMODE_SQUARE_WHITE,
    name: 'squareWhite',
  },
];

export default exportFrameModes;
