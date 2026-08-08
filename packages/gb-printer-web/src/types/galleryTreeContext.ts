import { type TreeImageGroup } from 'gb-printer-schemas';
import { DialogOption } from '@/types/Dialog';
import { type GroupItem, type ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

export interface GetUrlParams {
  pageIndex?: number;
  group?: string;
}

export interface GalleryTreeContextType {
  view: TreeImageGroup | null; // 'view' contains images and groups
  viewItems: GroupItem[];
  groupsByFullSlug: Map<string, TreeImageGroup>;
  groupsById: Map<string, TreeImageGroup>;
  pathsOptions: DialogOption[];
  isWorking: boolean;
  paging: ItemsSourcePaging | null;
  currentPageIndex: number;
  path: string;
  lastGalleryLink: string;
  getUrl: (params: GetUrlParams) => string;
}

export type SetErrorFn = (error: string) => void;
