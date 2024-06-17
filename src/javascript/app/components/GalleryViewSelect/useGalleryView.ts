import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { GalleryViews } from '../../../consts/GalleryViews';
import type { GalleryViewAction } from '../../../../types/actions/GalleryViewAction';

interface UseGalleryView {
  currentView: GalleryViews,
  updateView: (view: GalleryViews) => void,
}

export const useGalleryView = (): UseGalleryView => {
  const currentView = useSelector((state: State) => state.galleryView);
  const dispatch = useDispatch();

  const updateView = (view: GalleryViews) => {
    dispatch<GalleryViewAction>({
      type: Actions.SET_CURRENT_GALLERY_VIEW,
      payload: view,
    });
  };

  return {
    currentView,
    updateView,
  };
};
