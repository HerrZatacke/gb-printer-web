import { useContext } from 'react';
import { galleryTreeContext } from '@/contexts/galleryTree/Provider';
import { type GalleryTreeContextType } from '@/types/galleryTreeContext';

export const useGalleryTreeContext = (): GalleryTreeContextType => useContext<GalleryTreeContextType>(galleryTreeContext);
