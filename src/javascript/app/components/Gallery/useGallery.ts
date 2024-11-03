import { useSelector } from 'react-redux';
import useFiltersStore from '../../stores/filtersStore';
import useSettingsStore from '../../stores/settingsStore';
import { getFilteredImages } from '../../../tools/getFilteredImages';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';
import useGetValidPageIndex from '../../../tools/useGetValidPageIndex';
import type { State } from '../../store/State';
import type { GalleryViews } from '../../../consts/GalleryViews';
import type { Image } from '../../../../types/Image';

interface UseGallery {
  imageCount: number,
  selectedCount: number,
  images: Image[],
  galleryView: GalleryViews,
  filteredCount: number,
  valid: boolean,
  page: number,
}

export const useGallery = (): UseGallery => {
  const { pageSize, galleryView } = useSettingsStore();
  const {
    imageSelection,
    filtersActiveTags,
    recentImports,
    sortBy,
  } = useFiltersStore();

  const stateImages = useSelector((state: State) => (state.images));
  const imageCount = stateImages.length;
  const filteredCount = getFilteredImagesCount(stateImages, filtersActiveTags, recentImports);

  const { valid, page } = useGetValidPageIndex({ pageSize, imageCount: filteredCount });
  const iOffset = page * pageSize;
  const pSize = pageSize;
  const selectedCount = imageSelection.length;
  const images = getFilteredImages(
    stateImages,
    { filtersActiveTags, recentImports, sortBy },
  )
    .splice(iOffset, pSize || Infinity);

  return {
    imageCount,
    selectedCount,
    filteredCount,
    valid,
    page,
    images,
    galleryView,
  };
};
