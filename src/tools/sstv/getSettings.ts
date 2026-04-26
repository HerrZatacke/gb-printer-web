import { getDimensions } from '@/tools/sstv/getDimensions';
import { ModeType, type SSTVSettings, type VoxTones } from '@/tools/sstv/types';

export const voxTones: VoxTones = {
  durationMs: 100,
  freqToneLow: 1500,
  freqToneMid: 1900,
  freqToneHigh: 2300,
};

const sstvCommon: SSTVSettings = {
  // Leader + Break + Leader
  leaderMs: 300,
  leaderFreq: 1900,
  breakMs: 10,
  breakFreq: 1200,

  freqBlack: 1500,
  freqWhite: 2300,

  visCode: -1,
  width: -1,
  height: -1,
  channelDurationMs: -1,

  visBitMs: 30,
  startStopBitFreq: 1200,
  highBitFreq: 1100,
  lowBitFreq: 1300,

  syncMs: -1, // Robot: 9.0
  syncFreq: 1200,

  porchMs: -1, // Robot: 3.0
  porchFreq: 1500,
};

/*
  MARTIN
*/
const martinCommon: SSTVSettings = {
  ...sstvCommon,
  syncMs: 4.862,
  porchMs: 0.572,
};

const martin1: SSTVSettings = {
  ...martinCommon,
  visCode: 44,
  channelDurationMs: 146.432,
};

const martin2: SSTVSettings = {
  ...martinCommon,
  visCode: 40,
  channelDurationMs: 73.216,
};


/*
  ROBOT
*/
const robotCommon: SSTVSettings = {
  ...sstvCommon,
  syncMs: 9.0,
  porchMs: 3.0,
};

const robot36: SSTVSettings = {
  ...robotCommon,
  visCode: 8,
  channelDurationMs: 90,
};

const robot72: SSTVSettings = {
  ...robotCommon,
  visCode: 12,
  channelDurationMs: 138,
};


export const getSettings = (mode: ModeType): SSTVSettings => {
  const { width, height } = getDimensions(mode);

  let settings: SSTVSettings;

  switch (mode) {
    case ModeType.MARTIN_1:
      settings = martin1;
      break;
    case ModeType.MARTIN_2:
      settings = martin2;
      break;
    case ModeType.ROBOT_36:
      settings = robot36;
      break;
    case ModeType.ROBOT_72:
      settings = robot72;
      break;
    default:
      throw new Error(`Unknown mode "${mode}"`);
  }

  return {
    ...settings,
    width,
    height,
  };
};
