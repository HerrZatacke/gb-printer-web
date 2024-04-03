export enum ExportFrameMode {
  FRAMEMODE_KEEP = 'keep',
  FRAMEMODE_CROP = 'crop',
  FRAMEMODE_SQUARE_BLACK = 'square_black',
  FRAMEMODE_SQUARE_WHITE = 'square_white',
  FRAMEMODE_SQUARE_SMART = 'square_smart',
}

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
  {
    id: ExportFrameMode.FRAMEMODE_SQUARE_SMART,
    name: 'Make image squared (smart - repeats first/last line - works in most cases...)',
  },
];

export default exportFrameModes;
