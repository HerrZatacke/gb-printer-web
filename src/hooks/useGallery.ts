import { redirect } from 'next/navigation';
import { useMemo } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import useFiltersStore from '@/stores/filtersStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
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
    filtersActiveTags,
    recentImports,
    sortBy,
  } = useFiltersStore();

  const { images: stateImages } = useItemsStore();

  const totalImageCount = stateImages.length;
  const filteredCount = getFilteredImagesCount(view.images, filtersActiveTags, recentImports);
  const totalPages = pageSize ? Math.ceil(view.images.length / pageSize) : 1;
  const maxPage = Math.max(0, totalPages - 1);
  const page = Math.max(0, Math.min(pageIndex, maxPage));

  if (totalPages > 0 && page !== pageIndex) {
    redirect(getUrl({ pageIndex: page }));
  }

  const iOffset = page * pageSize;
  const pSize = pageSize;
  const selectedCount = imageSelection.length;
  const images = getFilteredImages(
    view.images,
    { filtersActiveTags, recentImports, sortBy },
  )
    .splice(iOffset, pSize || Infinity);

  const maxPageIndex = useMemo(() => (
    pageSize ?
      Math.ceil(getFilteredImagesCount(view.images, filtersActiveTags, recentImports) / pageSize) - 1 :
      0
  ), [filtersActiveTags, pageSize, recentImports, view]);

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
