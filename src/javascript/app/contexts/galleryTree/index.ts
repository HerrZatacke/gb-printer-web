import { createContext, useContext } from 'react';
import type { Context } from 'react';
import type { TreeImageGroup } from '../../../../types/ImageGroup';
import type { Image } from '../../../../types/Image';
import type { DialogOption } from '../../../../types/Dialog';

export const createRoot = (): TreeImageGroup => ({
  id: 'ROOT',
  slug: '',
  created: '',
  title: '🏠',
  coverImage: '',
  images: [],
  groups: [],
});

export interface PathMap {
  absolutePath: string
  group: TreeImageGroup,
}

export interface GalleryTreeContext {
  root: TreeImageGroup, // always the root element
  view: TreeImageGroup, // 'view' contains images and coverImages (=groups)
  images: Image[], // 'images' contains only actual images (without covers/groups)
  covers: string[],
  paths: PathMap[],
  pathsOptions: DialogOption[],
}

const rootView = createRoot();

export const galleryTreeContext: Context<GalleryTreeContext> = createContext<GalleryTreeContext>({
  root: rootView,
  view: rootView,
  images: [],
  covers: [],
  paths: [],
  pathsOptions: [],
});

export const useGalleryTreeContext = (): GalleryTreeContext => useContext<GalleryTreeContext>(galleryTreeContext);
