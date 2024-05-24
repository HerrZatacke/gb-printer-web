import { ExportFrameMode } from 'gb-image-decoder';

const exportFrameModes = [
  {
    id: ExportFrameMode.FRAMEMODE_KEEP,
    name: 'Keep frame',
  },
  {
    id: ExportFrameMode.FRAMEMODE_CROP,
    name: 'Crop frame',
  },
  {
    id: ExportFrameMode.FRAMEMODE_SQUARE_BLACK,
    name: 'Make image squared (add black)',
  },
  {
    id: ExportFrameMode.FRAMEMODE_SQUARE_WHITE,
    name: 'Make image squared (add white)',
  },
];

export default exportFrameModes;
