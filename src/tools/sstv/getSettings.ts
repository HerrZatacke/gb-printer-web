import { getDimensions } from '@/tools/sstv/getDimensions';
import { ModeType, type SSTVSettings, type VoxTones } from '@/tools/sstv/types';

export const voxTones: VoxTones = {
  durationMs: 100,
  freqToneLow: 1500,
  freqToneMid: 1900,
  freqToneHigh: 2300,
};

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

/*
  MARTIN
*/
const martinCommon: SSTVSettings = {
  ...sstvCommon,
  visCode: 32,
  syncMs: 4.862,
  porchMs: 0.572,
};

const martin1: SSTVSettings = {
  ...martinCommon,
  pixelMs: 0.4576,
};

const martin2: SSTVSettings = {
  ...martinCommon,
  pixelMs: 0.2288,
};


/*
  ROBOT
*/
const robotCommon: SSTVSettings = {
  ...sstvCommon,
  syncMs: 9.0,
  porchMs: 3.0,
  visCode: 0,
};

const robot36: SSTVSettings = {
  ...robotCommon,
  pixelMs: 0.2752, // somehow wrong
};

const robot72: SSTVSettings = {
  ...robotCommon,
  pixelMs: 0.2752, // somehow wrong
};


export const getSettings = (mode: ModeType): SSTVSettings => {
  const { width, height, visPartial } = getDimensions(mode);

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

  console.log({
    mode,
    'settings.visCode': settings.visCode,
    visPartial,
    // eslint-disable-next-line no-bitwise
    combined: settings.visCode | visPartial,
  });

  return {
    ...settings,
    width,
    height,
    // eslint-disable-next-line no-bitwise
    visCode: settings.visCode | visPartial,
  };
};
