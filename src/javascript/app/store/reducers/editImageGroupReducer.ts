/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { EditImageGroupAction, CancelEditImageGroupAction } from '../../../../types/actions/GroupActions';


const editImageGroupReducer = (
  value: string | null = null,
  action:
    EditImageGroupAction |
    CancelEditImageGroupAction,
): string | null => {
  switch (action.type) {
    case Actions.EDIT_IMAGE_GROUP:
      return action.payload;
    case Actions.CANCEL_EDIT_IMAGE_GROUP:
      return null;
    default:
      return value;
  }
};

export default editImageGroupReducer;
