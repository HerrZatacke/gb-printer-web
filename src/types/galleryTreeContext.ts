import { DialogOption } from '@/types/Dialog';
import { type Image } from '@/types/Image';
import { type TreeImageGroup } from '@/types/ImageGroup';
import { type ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

export interface GetUrlParams {
  pageIndex?: number;
  group?: string;
}

export interface GalleryTreeContextType {
  view: TreeImageGroup | null; // 'view' contains images and coverImages (=groups)
  images: Image[];
  covers: string[];
  groupsByFullSlug: Map<string, TreeImageGroup>;
  groupsById: Map<string, TreeImageGroup>;
  pathsOptions: DialogOption[];
  isWorking: boolean;
  paging: ItemsSourcePaging | null;
  path: string;
  lastGalleryLink: string;
  getUrl: (params: GetUrlParams) => string;
}

export type SetErrorFn = (error: string) => void;
