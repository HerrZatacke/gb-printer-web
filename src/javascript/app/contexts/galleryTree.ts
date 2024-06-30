import { createContext, useContext } from 'react';
import type { Context } from 'react';
import type { TreeImageGroup } from '../../../types/ImageGroup';
import type { Image } from '../../../types/Image';

export const createRoot = (): TreeImageGroup => ({
  id: 'ROOT',
  slug: '',
  created: '',
  title: '',
  coverImage: '',
  images: [],
  groups: [],
});

export interface PathMap {
  absolutePath: string
  group: TreeImageGroup,
}

export interface GalleryTreeContext {
  view: TreeImageGroup, // 'view' contains images and coverImages (=groups)
  images: Image[], // 'images' contains only actual images (without covers/groups)
  covers: string[],
  paths: PathMap[],
}

export const galleryTreeContext: Context<GalleryTreeContext> = createContext<GalleryTreeContext>({
  view: createRoot(),
  images: [],
  covers: [],
  paths: [],
});

export const useGalleryTreeContext = (): GalleryTreeContext => useContext<GalleryTreeContext>(galleryTreeContext);

export const GalleryTreeContextProvider = galleryTreeContext.Provider;
