import { Actions } from '../../javascript/app/store/actions';
import { GalleryViews } from '../../javascript/consts/GalleryViews';

export interface GalleryViewAction {
  type: Actions.SET_CURRENT_GALLERY_VIEW,
  payload?: GalleryViews
}
