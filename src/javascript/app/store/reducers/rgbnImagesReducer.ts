/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import type {
  DeleteImageAction,
  DeleteImagesAction,
  NewRGBNImageAction,
  UpdateRGBNPartAction,
} from '../../../../types/actions/ImageActions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { RGBNHashes } from '../../../../types/Image';

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
      if (action.payload?.rgbnImages) {
        return value && updateIfDefined<RGBNHashes>(action.payload.rgbnImages, value);
      }

      return value;
    default:
      return value;
  }
};

export default rgbnImagesReducer;
