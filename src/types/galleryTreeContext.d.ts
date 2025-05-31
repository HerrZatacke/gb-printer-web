import { DialogOption } from '@/types/Dialog';
import type { Image } from '@/types/Image';
import { SerializableImageGroup, TreeImageGroup } from '@/types/ImageGroup';

export interface CalculateRootWorkerParams {
  imageGroups: SerializableImageGroup[],
  stateImages: Image[],
}

export interface CalculateRootWorkerResult {
  type: 'result',
  root: TreeImageGroup,
  paths: PathMap[],
  pathsOptions: DialogOption[],
  duration: number,
}

export interface CalculateRootWorkerError {
  type: 'error',
  error: string,
}

export interface PathMap {
  absolutePath: string
  group: TreeImageGroup,
}

export interface GalleryTreeContextType {
  root: TreeImageGroup, // always the root element
  view: TreeImageGroup, // 'view' contains images and coverImages (=groups)
  images: Image[], // 'images' contains only actual images (without covers/groups)
  covers: string[],
  paths: PathMap[],
  pathsOptions: DialogOption[],
  isWorking: boolean,
}
