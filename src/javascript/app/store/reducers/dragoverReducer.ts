/* eslint-disable default-param-last */
import { Actions } from '../actions';

interface DragoverAction {
  type: Actions.IMPORT_DRAGOVER_START | Actions.IMPORT_DRAGOVER_END,
}

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
