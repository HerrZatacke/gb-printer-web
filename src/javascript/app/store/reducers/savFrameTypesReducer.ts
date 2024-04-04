/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface SavFrameTypesAction {
  type: Actions.SET_SAV_FRAME_TYPES,
  payload: string,
}

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
