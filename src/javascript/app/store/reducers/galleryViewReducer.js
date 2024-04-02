/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';

const galleryViewReducer = (value = '1x', action) => {
  switch (action.type) {
    case Actions.SET_CURRENT_GALLERY_VIEW:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.galleryView, value);
    default:
      return value;
  }
};

export default galleryViewReducer;
