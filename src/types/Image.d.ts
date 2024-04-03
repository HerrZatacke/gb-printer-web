export interface ImageMetadata extends Record<string, unknown>{
  romType: string,
  userId: string,
  birthDate: string,
  userName: string,
  gender: string,
  bloodType: string,
  comment: string,
  isCopy: boolean,
}

interface CommonImage {
  hash: string,
  created: string,
  title: string,
  tags: string[],
  meta?: ImageMetadata
}

interface RGBNPalette {
  r?: number[],
  g?: number[],
  b?: number[],
  n?: number[],
  blend?: string,
}

interface RGBNHashes {
  r?: string,
  g?: string,
  b?: string,
  n?: string,
}

interface RGBNImage extends CommonImage {
  palette: RGBNPalette,
  hashes: RGBNHashes,
}

interface MonochromeImage extends CommonImage {
  lines: number,
  palette: string,
  frame: string,
}

export type Image = MonochromeImage | RGBNImage
