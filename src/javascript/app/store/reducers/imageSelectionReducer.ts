/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { DeleteImageAction, DeleteImagesAction } from '../../../../types/actions/ImageActions';

type ImageSelectionAction = {
  type: Actions.IMAGE_SELECTION_REMOVE | Actions.IMAGE_SELECTION_ADD,
  payload: string,
} | {
  type: Actions.IMAGE_SELECTION_SET
  payload: string[],
}

const imageSelectionReducer = (
  value: string[] = [],
  action: ImageSelectionAction | DeleteImageAction | DeleteImagesAction | GlobalUpdateAction,
): string[] => {
  switch (action.type) {
    case Actions.IMAGE_SELECTION_REMOVE:
    case Actions.DELETE_IMAGE:
      return [...value.filter((hash) => hash !== action.payload)];
    case Actions.IMAGE_SELECTION_ADD:
      return [...value, action.payload];
    case Actions.IMAGE_SELECTION_SET:
      return action.payload;
    case Actions.DELETE_IMAGES:
      return [];
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.imageSelection, value);
    default:
      return value;
  }
};

export default imageSelectionReducer;
