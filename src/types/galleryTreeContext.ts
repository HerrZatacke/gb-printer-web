import { DialogOption } from '@/types/Dialog';
import { type Image } from '@/types/Image';
import { type NewTreeImageGroup } from '@/types/ImageGroup';
import { type ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

// ToDo: obsolete because NewTreeImageGroup already holds "fullSlug" property
export interface PathMap {
  absolutePath: string;
  group: NewTreeImageGroup;
}

export interface GetUrlParams {
  pageIndex?: number;
  group?: string;
}

export interface GalleryTreeContextType {
  view: NewTreeImageGroup | null; // 'view' contains images and coverImages (=groups)
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
