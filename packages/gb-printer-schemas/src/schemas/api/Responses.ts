import { ItemStoreNames } from '@/schemas/api/consts';

export interface ItemsSourcePaging {
  filtered: number;
  total: number;
  page: number;
  pageSize: number;
  maxPageIndex: number;
}

export interface ItemsSourceResponse<T> {
  items: T[];
  paging: ItemsSourcePaging;
  duration: number;
}

export interface ItemsSourceTotalResponse<T> {
  items: T[];
  total: number;
  duration: number;
}

export interface RootItemSourceResponse<T> {
  item: T;
  totalCount: number;
  duration: number;
}

export interface ItemsStatsTotals {
  palettes: number;
  plugins: number;
  frames: number;
  frameGroups: number;
  images: number;
  imageGroups: number;
  binaryImages: number;
  binaryFrames: number;
}

export interface ItemsStatsResponse {
  totals: ItemsStatsTotals;
  duration: number;
}

export interface PaletteUsage {
  shortName: string;
  usage: number;
}

export interface FrameUsage {
  id: string;
  usage: number;
}

export interface ItemsUsageTotals {
  palettes: PaletteUsage[];
  frames: FrameUsage[];
}

export interface ItemsUsageReponse {
  totals: ItemsUsageTotals;
  duration: number;
}

export interface ItemsInvalidation {
  collection: ItemStoreNames;
  identifier?: string;
}

export interface ItemsMutationReponse {
  invalidations: ItemsInvalidation[];
  duration: number;
}
