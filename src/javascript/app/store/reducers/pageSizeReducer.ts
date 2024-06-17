/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { PageSizeAction } from '../../../../types/actions/GlobalActions';

const pageSizeReducer = (value = 0, action: PageSizeAction | GlobalUpdateAction): number => {
  switch (action.type) {
    case Actions.SET_PAGESIZE:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<number>(action.payload?.pageSize, value);
    default:
      return value;
  }
};

export default pageSizeReducer;
