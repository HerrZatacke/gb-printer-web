/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { DeleteImageAction, DeleteImagesAction } from '../../../../types/actions/ImageActions';
import { ImageSelectionActionAddRemove, ImageSelectionSet } from '../../../../types/actions/ImageSelectionActions';


const imageSelectionReducer = (
  value: string[] = [],
  action:
    ImageSelectionActionAddRemove |
    ImageSelectionSet |
    DeleteImageAction |
    DeleteImagesAction |
    GlobalUpdateAction,
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
      return updateIfDefined<string[]>(action.payload?.imageSelection, value);
    default:
      return value;
  }
};

export default imageSelectionReducer;
