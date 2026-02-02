import { redirect } from 'next/navigation';
import { useMemo } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import {
  useFiltersStore,
  useItemsStore,
  useSettingsStore,
} from '@/stores/stores';
import { getFilteredImages } from '@/tools/getFilteredImages';
import getFilteredImagesCount from '@/tools/getFilteredImages/count';
import type { Image } from '@/types/Image';

interface UseGallery {
  totalImageCount: number,
  selectedCount: number,
  images: Image[],
  filteredCount: number,
  page: number,
  maxPageIndex: number,
  covers: string[],
  isWorking: boolean,
}

export const useGallery = (): UseGallery => {
  const { pageIndex, getUrl, view, covers, isWorking } = useGalleryTreeContext();
  const { pageSize } = useSettingsStore();

  const {
    imageSelection,
    filtersTags,
    filtersPalettes,
    filtersFrames,
    recentImports,
    sortBy,
  } = useFiltersStore();

  const { images: stateImages } = useItemsStore();

  const totalImageCount = stateImages.length;
  const filteredCount = getFilteredImagesCount(view, filtersTags, filtersFrames, filtersPalettes, recentImports);
  const totalPages = pageSize ? Math.ceil(view.images.length / pageSize) : 1;
  const maxPage = Math.max(0, totalPages - 1);
  const page = Math.max(0, Math.min(pageIndex, maxPage));

  if (totalPages > 0 && page !== pageIndex) {
    redirect(getUrl({ pageIndex: page }));
  }

  const iOffset = page * pageSize;
  const pSize = pageSize;
  const selectedCount = imageSelection.length;

  const images = useMemo(() => (
    getFilteredImages(
      view,
      {
        filtersTags,
        filtersFrames,
        filtersPalettes,
        recentImports,
        sortBy,
      },
    )
      .splice(iOffset, pSize || Infinity)
  ), [filtersFrames, filtersPalettes, filtersTags, iOffset, pSize, recentImports, sortBy, view]);

  const maxPageIndex = useMemo(() => (
    pageSize ?
      Math.ceil(getFilteredImagesCount(view, filtersTags, filtersFrames, filtersPalettes, recentImports) / pageSize) - 1 :
      0
  ), [filtersFrames, filtersPalettes, filtersTags, pageSize, recentImports, view]);

  return {
    totalImageCount,
    selectedCount,
    filteredCount,
    page,
    maxPageIndex,
    images,
    covers,
    isWorking,
  };
};
