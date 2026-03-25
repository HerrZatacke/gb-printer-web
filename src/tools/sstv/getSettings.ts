import { ModeType, type SSTVSettings } from '@/tools/sstv/types';

const sstvCommon: SSTVSettings = {
  startStopBitFreq: 1200,
  highBitFreq: 1100,
  lowBitFreq: 1300,
  visCode: -1,
  width: -1,
  height: -1,
  pixelMs: -1,
  syncMs: -1,
  porchMs: -1,
  freqBlack: 1500,
  freqWhite: 2300,
  syncFreq: 1200,
  porchFreq: 1500,
  leaderFreq: 1900,
  leaderMs: 300,
  breakFreq: 1200,
  breakMs: 10,
  visBitMs: 30,
};

const martinCommon: SSTVSettings = {
  ...sstvCommon,
  pixelMs: 0.4576,
  syncMs: 4.862,
  porchMs: 0.572,
};

const martin1: SSTVSettings = {
  ...martinCommon,
  visCode: 44,
  width: 320,
  height: 256,
};

const martin2: SSTVSettings = {
  ...martinCommon,
  visCode: 45,
  width: 160,
  height: 256,
};


const robotCommon: SSTVSettings = {
  ...sstvCommon,
  syncMs: 9.0,
  porchMs: 3.0,
};

const robot32: SSTVSettings = {
  ...robotCommon,
  visCode: 8, // Probably wrong
  width: 160, // Probably wrong
  height: 240, // Probably wrong
  pixelMs: 0.2752, // Probably wrong
};

const robot36: SSTVSettings = {
  ...robotCommon,
  visCode: 8, // somehow wrong
  width: 160, // somehow wrong
  height: 240, // somehow wrong
  pixelMs: 0.4576, // somehow wrong
};

const robot72: SSTVSettings = {
  ...robotCommon,
  visCode: 12, // somehow wrong
  width: 320, // somehow wrong
  height: 240, // somehow wrong
  pixelMs: 0.2752, // somehow wrong
};


export const getSettings = (mode: ModeType): SSTVSettings => {
  switch (mode) {
    case ModeType.MARTIN_1:
      return martin1;
    case ModeType.MARTIN_2:
      return martin2;
    case ModeType.ROBOT_32:
      return robot32;
    case ModeType.ROBOT_36:
      return robot36;
    case ModeType.ROBOT_72:
      return robot72;
    default:
      throw new Error(`Unknown mode "${mode}"`);
  }
};
