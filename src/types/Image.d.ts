import { BlendMode } from '../javascript/tools/RGBNDecoder/blendModes';

export interface ImageMetadata extends Record<string, unknown>{
  romType?: string,
  userId?: string,
  birthDate?: string,
  userName?: string,
  gender?: string,
  bloodType?: string,
  comment?: string,
  isCopy?: boolean,
  exposure?: string,
  captureMode?: string,
  edgeExclusive?: string,
  edgeOperation?: string,
  gain?: string,
  edgeMode?: string,
  invertOut?: string,
  voltageRef?: string,
  zeroPoint?: string,
  vOut?: string,
}

interface CommonImage {
  hash: string,
  created: string,
  title: string,
  frame: string | null,
  tags: string[],
  meta?: ImageMetadata
}

export interface RGBNPalette {
  r?: number[], // ToDo BWPalette??
  g?: number[],
  b?: number[],
  n?: number[],
  blend?: BlendMode,
}

export interface RGBNHashes {
  r?: string,
  g?: string,
  b?: string,
  n?: string,
}

export interface RGBNImage extends CommonImage {
  palette: RGBNPalette,
  hashes: RGBNHashes,
}

export interface MonochromeImage extends CommonImage {
  lines: number,
  palette: string, // ToDo BWPalette??
}

export type Image = MonochromeImage | RGBNImage


export interface CurrentEditSingleImage {
  hash: string,
}

export interface CurrentEditBatch {
  hash: string,
  batch: string[],
  tags: string[],
}
