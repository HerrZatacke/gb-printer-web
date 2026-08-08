import { Image, ImageMetadata } from 'gb-printer-schemas';
import { type ImportMethod } from '@/consts/ImportMethod';

export interface ImportItem {
  fileName:string;
  imageHash:string;
  tiles: string[];
  lastModified?: number;
  tempId: string;
  meta?: ImageMetadata;
}

export interface FlaggedImportItem extends ImportItem {
  isDuplicateInQueue: boolean;
  alreadyImported: Image | null;
}

export interface ImportResult {
  imageCount: number;
  importMethod: ImportMethod;
}
