import { DialogOption } from '@/types/Dialog';
import type { Image } from '@/types/Image';
import { SerializableImageGroup, TreeImageGroup } from '@/types/ImageGroup';

export interface CalculateRootWorkerParams {
  imageGroups: SerializableImageGroup[],
  stateImages: Image[],
}

export interface CalculateRootWorkerResult {
  root: TreeImageGroup,
  paths: PathMap[],
  pathsOptions: DialogOption[],
  duration: number,
}

export interface PathMap {
  absolutePath: string
  group: TreeImageGroup,
}

export interface GetUrlParams {
  pageIndex?: number,
  group?: string,
}

export interface GalleryTreeContextType {
  root: TreeImageGroup, // always the root element
  view: TreeImageGroup, // 'view' contains images and coverImages (=groups)
  images: Image[], // 'images' contains only actual images (without covers/groups)
  covers: string[],
  paths: PathMap[],
  pathsOptions: DialogOption[],
  isWorking: boolean,
  pageIndex: number,
  path: string,
  lastGalleryLink: string,
  getUrl: (params: GetUrlParams) => string,
}

export type SetErrorFn = (error: string) => void;

export interface TreeContextWorkerApi {
  calculate: (
    params: CalculateRootWorkerParams,
    setError: SetErrorFn,
  ) => Promise<CalculateRootWorkerResult>,
}
