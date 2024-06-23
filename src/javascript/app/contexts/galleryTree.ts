import { createContext, useContext } from 'react';
import type { Context } from 'react';
import type { TreeImageGroup } from '../../../types/ImageGroup';

export const createRoot = (): TreeImageGroup => ({
  id: 'ROOT',
  slug: '',
  created: '',
  title: '',
  coverImage: '',
  images: [],
  groups: [],
});

export type PathMap = Record<string, TreeImageGroup>;

export interface GalleryTreeContext {
  view: TreeImageGroup,
  covers: string[],
  paths: PathMap,
}

export const galleryTreeContext: Context<GalleryTreeContext> = createContext<GalleryTreeContext>({
  view: createRoot(),
  covers: [],
  paths: {},
});

export const useGalleryTreeContext = (): GalleryTreeContext => useContext<GalleryTreeContext>(galleryTreeContext);

export const GalleryTreeContextProvider = galleryTreeContext.Provider;
