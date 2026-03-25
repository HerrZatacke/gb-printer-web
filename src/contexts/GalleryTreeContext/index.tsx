'use client';

import React, { createContext, useContext } from 'react';
import { type PropsWithChildren } from 'react';
import { useContextHook } from '@/contexts/GalleryTreeContext/hook';
import { type GalleryTreeContextType } from '@/types/galleryTreeContext';

export const galleryTreeContext = createContext<GalleryTreeContextType | null>(null);

export function GalleryTreeProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();
  console.log({ contextValue });
  return (
    <galleryTreeContext.Provider value={contextValue}>
      { children }
    </galleryTreeContext.Provider>
  );
}

export const useGalleryTreeContext = (): GalleryTreeContextType => {
  const context = useContext(galleryTreeContext);
  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};

