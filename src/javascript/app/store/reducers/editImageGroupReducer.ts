/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  AddImageGroupAction,
  UpdateImageGroupAction,
  EditImageGroupAction,
  CancelEditImageGroupAction,
  EditGroupInfo,
} from '../../../../types/actions/GroupActions';

const editImageGroupReducer = (
  value: EditGroupInfo | null = null,
  action:
    AddImageGroupAction |
    UpdateImageGroupAction |
    EditImageGroupAction |
    CancelEditImageGroupAction,
): EditGroupInfo | null => {
  switch (action.type) {
    case Actions.EDIT_IMAGE_GROUP:
      return action.payload;
    case Actions.ADD_IMAGE_GROUP:
    case Actions.CANCEL_EDIT_IMAGE_GROUP:
    case Actions.UPDATE_IMAGE_GROUP:
      return null;
    default:
      return value;
  }
};

export default editImageGroupReducer;
