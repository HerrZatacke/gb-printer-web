export const ModeType = {
  MARTIN_1: 'M1',
  MARTIN_2: 'M2',
  // ROBOT_8: 'R8',
  // ROBOT_12: 'R12',
  // ROBOT_24: 'R24',
  ROBOT_36: 'R36',
  ROBOT_72: 'R72',
  SCOTTIE_1: 'S1',
  SCOTTIE_2: 'S2',
  SCOTTIE_DX: 'SDX',
} as const;
export type ModeType = (typeof ModeType)[keyof typeof ModeType];

export interface VoxTones {
  durationMs: number;
  freqToneLow: number;
  freqToneMid: number;
  freqToneHigh: number;
}

export interface SSTVDimensions {
  width: number;
  height: number;
}

export interface SSTVSettings {
  startStopBitFreq: number;
  highBitFreq: number;
  lowBitFreq: number;
  visCode: number;
  width: number;
  height: number;
  channelDurationMs: number;
  syncMs: number;
  porchMs: number;
  freqBlack: number;
  freqWhite: number;
  syncFreq: number;
  porchFreq: number;
  leaderFreq: number;
  leaderMs: number;
  breakFreq: number;
  breakMs: number;
  visBitMs: number;
}

export interface Sample {
  freq: number;
  durationMs: number;
}

export const RGBChannel = {
  RED: 'r',
  GREEN: 'g',
  BLUE: 'b',
} as const;
export type RGBChannel = (typeof RGBChannel)[keyof typeof RGBChannel];


export interface SamplesResult {
  samples: Sample[];
  settings: SSTVSettings;
  imageData: ImageData;
}
