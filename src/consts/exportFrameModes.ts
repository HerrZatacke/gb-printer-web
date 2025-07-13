import { ExportFrameMode } from 'gb-image-decoder';

const exportFrameModes = [
  {
    id: ExportFrameMode.FRAMEMODE_KEEP,
    name: 'frameModes.keepFrame',
  },
  {
    id: ExportFrameMode.FRAMEMODE_CROP,
    name: 'frameModes.cropFrame',
  },
  {
    id: ExportFrameMode.FRAMEMODE_SQUARE_BLACK,
    name: 'frameModes.squareBlack',
  },
  {
    id: ExportFrameMode.FRAMEMODE_SQUARE_WHITE,
    name: 'frameModes.squareWhite',
  },
];

export default exportFrameModes;
