/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { DeleteImageAction, DeleteImagesAction, NewRGBNImageAction } from '../../../../types/actions/ImageActions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { RGBNHashes } from '../../../../types/Image';

export interface UpdateRGBNPartAction {
  type: Actions.UPDATE_RGBN_PART,
  payload: RGBNHashes,
}

const rgbnImagesReducer = (
  value: RGBNHashes | null = null,
  action:
    UpdateRGBNPartAction |
    DeleteImageAction |
    DeleteImagesAction |
    NewRGBNImageAction |
    GlobalUpdateAction,
): RGBNHashes | null => {
  switch (action.type) {
    case Actions.UPDATE_RGBN_PART: {
      const newVal = { ...value, ...action.payload };
      return newVal.r || newVal.g || newVal.b || newVal.n ? newVal : null;
    }

    case Actions.SAVE_RGBN_IMAGE:
      return null;
    case Actions.DELETE_IMAGE:
    case Actions.DELETE_IMAGES:
      return null;
    case Actions.GLOBAL_UPDATE:
      return value && updateIfDefined<RGBNHashes>(action.payload?.rgbnImages, value);
    default:
      return value;
  }
};

export default rgbnImagesReducer;
