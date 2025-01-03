import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import getFilteredImages from '../../../tools/getFilteredImages';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';
import { useGalleryParams } from '../../../hooks/useGalleryParams';
import type { State } from '../../store/State';
import type { GalleryViews } from '../../../consts/GalleryViews';
import type { Image } from '../../../../types/Image';
import { useGalleryTreeContext } from '../../contexts/galleryTree';

interface UseGallery {
  imageCount: number,
  selectedCount: number,
  images: Image[],
  currentView: GalleryViews,
  filteredCount: number,
  page: number,
  covers: string[],
}

export const useGallery = (): UseGallery => {
  const { view, covers } = useGalleryTreeContext();

  const {
    imageCount,
    pageSize,
    filteredCount,
  } = useSelector((state: State) => ({
    pageSize: state.pageSize,
    imageCount: state.images.length,
    filteredCount: getFilteredImagesCount(state, view.images),
  }));

  const { pageIndex, path } = useGalleryParams();
  const navigate = useNavigate();

  const totalPages = pageSize ? Math.ceil(imageCount / pageSize) : 1;
  const maxPage = Math.max(0, totalPages - 1);
  const page = Math.max(0, Math.min(pageIndex, maxPage));

  if (page !== pageIndex) {
    navigate(`/gallery/${path}page/${page + 1}`);
  }

  const {
    selectedCount,
    currentView,
    images,
  } = useSelector((state: State) => {
    const iOffset = page * state.pageSize;
    const pSize = state.pageSize;

    return ({
      selectedCount: state.imageSelection.length,
      currentView: state.galleryView,
      images: getFilteredImages(state, view.images).splice(iOffset, pSize || Infinity),
    });
  });

  return ({
    imageCount,
    selectedCount,
    filteredCount,
    page,
    images,
    currentView,
    covers,
  });
};
