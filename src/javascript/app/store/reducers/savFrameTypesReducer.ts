/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { SavFrameTypesAction } from '../../../../types/actions/FrameActions';

const savFrameTypesReducer = (value = 'int', action: SavFrameTypesAction | GlobalUpdateAction): string => {
  switch (action.type) {
    case Actions.SET_SAV_FRAME_TYPES:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<string>(action.payload?.savFrameTypes, value);
    default:
      return value;
  }
};

export default savFrameTypesReducer;
