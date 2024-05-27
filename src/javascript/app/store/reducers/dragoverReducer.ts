/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { DragoverAction } from '../../../../types/actions/GlobalActions';

const dragoverReducer = (value = false, action: DragoverAction): boolean => {
  switch (action.type) {
    case Actions.IMPORT_DRAGOVER_START:
      return true;
    case Actions.IMPORT_DRAGOVER_END:
      return false;
    default:
      return value;
  }
};

export default dragoverReducer;
