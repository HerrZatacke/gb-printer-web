/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { CancelCreateRGBImagesAction, StartCreateRGBImagesAction, SaveNewRGBImagesAction } from '../../../../types/actions/ImageActions';


const editRGBNImagesReducer = (
  value: string[] = [],
  action: StartCreateRGBImagesAction | CancelCreateRGBImagesAction | SaveNewRGBImagesAction,
): string[] => {
  switch (action.type) {
    case Actions.START_CREATE_RGB_IMAGES:
      return action.payload;
    case Actions.CANCEL_CREATE_RGB_IMAGES:
    case Actions.SAVE_NEW_RGB_IMAGES:
      return [];
    default:
      return value;
  }
};

export default editRGBNImagesReducer;
