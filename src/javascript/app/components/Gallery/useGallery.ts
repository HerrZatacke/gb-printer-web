import { useSelector } from 'react-redux';
import useSettingsStore from '../../stores/settingsStore';
import getFilteredImages from '../../../tools/getFilteredImages';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';
import useGetValidPageIndex from '../../../tools/useGetValidPageIndex';
import type { State } from '../../store/State';
import type { GalleryViews } from '../../../consts/GalleryViews';
import type { Image } from '../../../../types/Image';

interface UseGallery {
  imageCount: number,
  selectedCount: number,
  images: Image[],
  currentView: GalleryViews,
  filteredCount: number,
  valid: boolean,
  page: number,
}

export const useGallery = (): UseGallery => {
  const { pageSize } = useSettingsStore();
  const {
    imageCount,
    filteredCount,
  } = useSelector((state: State) => ({
    imageCount: state.images.length,
    filteredCount: getFilteredImagesCount(state),
  }));

  const { valid, page } = useGetValidPageIndex({ pageSize, imageCount: filteredCount });

  const {
    selectedCount,
    currentView,
    images,
  } = useSelector((state: State) => {
    const iOffset = page * pageSize;
    const pSize = pageSize;

    return ({
      selectedCount: state.imageSelection.length,
      currentView: state.galleryView,
      images: getFilteredImages(state).splice(iOffset, pSize || Infinity),
    });
  });

  return ({
    imageCount,
    selectedCount,
    filteredCount,
    valid,
    page,
    images,
    currentView,
  });
};
