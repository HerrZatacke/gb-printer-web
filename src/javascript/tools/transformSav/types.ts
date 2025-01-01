import type { Frame } from '../../../types/Frame';

export enum RomTypes {
  PHOTO = 'photo',
  STOCK = 'stock',
  PXLR = 'pxlr',
}

export interface RomByteOffsets {
  thumbnailByteCapture: number
  thumbnailByteEdgegains: number
  thumbnailByteExposureHigh: number
  thumbnailByteExposureLow: number
  thumbnailByteEdmovolt: number
  thumbnailByteVoutzero: number
  thumbnailByteDitherset: number
  thumbnailByteContrast: number
}

export interface CustomMetaData {
  romType: RomTypes,
  exposure: string,
  captureMode: string,
  edgeExclusive: string,
  edgeOperation: string,
  gain: string,
  edgeMode: string,
  invertOut: string,
  voltageRef: string,
  zeroPoint: string,
  vOut: string,
  ditherset?: string,
  contrast?: number,
}

export interface BasicMetaData {
  userId: string,
  birthDate: string,
  userName: string,
  gender: string,
  bloodType: string,
  comment: string,
  isCopy: boolean,
}

export type ImageMetaData = { romType: RomTypes} & Partial<CustomMetaData & BasicMetaData>;

export interface FileMetaData {
  cartIndex: number,
  albumIndex: number,
  baseAddress: number,
  frameNumber: number,
  meta?: ImageMetaData,
}

export interface WithTiles {
  tiles: string[],
}


export interface GenerateFilenameOptions {
  indexText: string,
  albumIndex: number,
  displayIndex: number,
}

export type GenerateFilenameFn = (options: GenerateFilenameOptions) => string

export type ImportSavFn = (selectedFrameset: string, cartIsJP: boolean) => Promise<boolean>

export interface ImportSavParams {
  importLastSeen: boolean,
  data: Uint8Array,
  lastModified: number,
  frames: Frame[],
  fileName: string | GenerateFilenameFn,
  importDeleted: boolean,
  forceMagicCheck: boolean,
}

