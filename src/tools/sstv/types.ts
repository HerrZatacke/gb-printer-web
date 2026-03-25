export enum ModeType {
  MARTIN_1 = 'M1',
  MARTIN_2 = 'M2',
  ROBOT_32 = 'R32',
  ROBOT_36 = 'R36',
  ROBOT_72 = 'R72',
}

export interface SSTVSettings {
  startStopBitFreq: number;
  highBitFreq: number;
  lowBitFreq: number;
  visCode: number;
  width: number;
  height: number;
  pixelMs: number;
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
