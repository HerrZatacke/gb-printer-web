import { ModeType, type SSTVDimensions } from '@/tools/sstv/types';

const sstvWidths: Record<ModeType, number> = {
  [ModeType.MARTIN_1]: 320,
  [ModeType.MARTIN_2]: 320,
  [ModeType.ROBOT_8]: 160,
  [ModeType.ROBOT_12]: 160,
  [ModeType.ROBOT_24]: 160,
  [ModeType.ROBOT_36]: 320,
  [ModeType.ROBOT_72]: 320,
  [ModeType.SCOTTIE_1]: 320,
  [ModeType.SCOTTIE_2]: 320,
  [ModeType.SCOTTIE_DX]: 320,
};

const sstvHeights: Record<ModeType, number> = {
  [ModeType.MARTIN_1]: 256,
  [ModeType.MARTIN_2]: 256,
  [ModeType.ROBOT_8]: 120,
  [ModeType.ROBOT_12]: 120,
  [ModeType.ROBOT_24]: 120,
  [ModeType.ROBOT_36]: 240,
  [ModeType.ROBOT_72]: 240,
  [ModeType.SCOTTIE_1]: 256,
  [ModeType.SCOTTIE_2]: 256,
  [ModeType.SCOTTIE_DX]: 256,
};

export const getDimensions = (modeType: ModeType): SSTVDimensions => {
  const width = sstvWidths[modeType];
  const height = sstvHeights[modeType];

  return {
    width,
    height,
  };
};
