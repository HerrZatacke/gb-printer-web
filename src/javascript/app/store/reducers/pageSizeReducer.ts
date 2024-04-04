/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface PageSizeAction {
  type: Actions.SET_PAGESIZE,
  payload: number,
}

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
