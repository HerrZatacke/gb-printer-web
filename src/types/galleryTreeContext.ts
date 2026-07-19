import { DialogOption } from '@/types/Dialog';
import { type Image } from '@/types/Image';
import {
  type SerializableImageGroup,
  type NewTreeImageGroup,
  type TreeImageGroup,
} from '@/types/ImageGroup';
import { type ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

export interface CalculateRootWorkerParams {
  imageGroups: SerializableImageGroup[];
  stateImages: Image[];
}

export interface CalculateRootWorkerResult {
  root: TreeImageGroup;
  paths: PathMap[];
  pathsOptions: DialogOption[];
  duration: number;
}

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

export interface TreeContextWorkerApi {
  calculate: (
    params: CalculateRootWorkerParams,
    setError: SetErrorFn,
  ) => Promise<CalculateRootWorkerResult>;
}
