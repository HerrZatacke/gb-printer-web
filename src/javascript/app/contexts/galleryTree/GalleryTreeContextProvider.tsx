import React from 'react';
import type { PropsWithChildren } from 'react';
import { useGalleryTreeContextValue } from '../../../hooks/useGalleryTreeContextValue';
import { galleryTreeContext } from './index';

function GalleryTreeContextProvider({ children }: PropsWithChildren) {
  const value = useGalleryTreeContextValue();

  return (
    <galleryTreeContext.Provider value={value}>
      { children }
    </galleryTreeContext.Provider>
  );
}

export default GalleryTreeContextProvider;

