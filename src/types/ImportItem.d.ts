import type { ImageMetadata } from './Image';

export interface ImportItem {
  fileName:string,
  imageHash:string,
  tiles: string[],
  lastModified?: number,
  tempId: string,
  meta?: ImageMetadata,
}
