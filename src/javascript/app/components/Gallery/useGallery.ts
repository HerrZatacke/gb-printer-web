import { useNavigate } from 'react-router-dom';
import useFiltersStore from '../../stores/filtersStore';
import useItemsStore from '../../stores/itemsStore';
import useSettingsStore from '../../stores/settingsStore';
import { getFilteredImages } from '../../../tools/getFilteredImages';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';
import { useGalleryParams } from '../../../hooks/useGalleryParams';
import type { GalleryViews } from '../../../consts/GalleryViews';
import type { Image } from '../../../../types/Image';
import { useGalleryTreeContext } from '../../contexts/galleryTree';

interface UseGallery {
  imageCount: number,
  selectedCount: number,
  images: Image[],
  galleryView: GalleryViews,
  filteredCount: number,
  page: number,
  covers: string[],
}

export const useGallery = (): UseGallery => {
  const { view, covers } = useGalleryTreeContext();
  const { pageSize, galleryView } = useSettingsStore();

  const {
    imageSelection,
    filtersActiveTags,
    recentImports,
    sortBy,
  } = useFiltersStore();

  const { images: stateImages } = useItemsStore();

  const imageCount = stateImages.length;
  const filteredCount = getFilteredImagesCount(view.images, filtersActiveTags, recentImports);

  const { pageIndex, path } = useGalleryParams();
  const navigate = useNavigate();

  const totalPages = pageSize ? Math.ceil(imageCount / pageSize) : 1;
  const maxPage = Math.max(0, totalPages - 1);
  const page = Math.max(0, Math.min(pageIndex, maxPage));

  if (page !== pageIndex) {
    navigate(`/gallery/${path}page/${page + 1}`);
  }

  const iOffset = page * pageSize;
  const pSize = pageSize;
  const selectedCount = imageSelection.length;
  const images = getFilteredImages(
    view.images,
    { filtersActiveTags, recentImports, sortBy },
  )
    .splice(iOffset, pSize || Infinity);

  return {
    imageCount,
    selectedCount,
    filteredCount,
    page,
    images,
    covers,
    galleryView,
  };
};
