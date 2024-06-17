/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { GalleryViews } from '../../../consts/GalleryViews';
import type { GalleryViewAction } from '../../../../types/actions/GalleryViewAction';

const galleryViewReducer = (
  value: GalleryViews = GalleryViews.GALLERY_VIEW_1X,
  action: GalleryViewAction | GlobalUpdateAction,
): GalleryViews => {
  switch (action.type) {
    case Actions.SET_CURRENT_GALLERY_VIEW:
      return action.payload || value;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<GalleryViews>(action.payload?.galleryView, value);
    default:
      return value;
  }
};

export default galleryViewReducer;
