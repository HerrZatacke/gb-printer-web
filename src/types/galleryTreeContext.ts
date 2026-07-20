import { DialogOption } from '@/types/Dialog';
import { type Image } from '@/types/Image';
import { type TreeImageGroup } from '@/types/ImageGroup';
import { type ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

// ToDo: obsolete because TreeImageGroup already holds "fullSlug" property
export interface PathMap {
  absolutePath: string;
  group: TreeImageGroup;
}

export interface GetUrlParams {
  pageIndex?: number;
  group?: string;
}

export interface GalleryTreeContextType {
  view: TreeImageGroup | null; // 'view' contains images and coverImages (=groups)
  images: Image[];
  covers: string[];
  paths: PathMap[];
  pathsOptions: DialogOption[];
  isWorking: boolean;
  paging: ItemsSourcePaging | null;
  path: string;
  lastGalleryLink: string;
  getUrl: (params: GetUrlParams) => string;
}

export type SetErrorFn = (error: string) => void;
