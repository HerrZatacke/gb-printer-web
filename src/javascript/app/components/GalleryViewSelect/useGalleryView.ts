import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import { GalleryViews } from '../../../consts/GalleryViews';

interface UseGalleryView {
  currentView: GalleryViews,
  updateView: (view: GalleryViews) => void,
}

export const useGalleryView = (): UseGalleryView => {
  const currentView = useSelector((state: State) => state.galleryView);
  const dispatch = useDispatch();

  const updateView = (view: GalleryViews) => {
    dispatch({
      type: Actions.SET_CURRENT_GALLERY_VIEW,
      payload: view,
    });
  };

  return {
    currentView,
    updateView,
  };
};
