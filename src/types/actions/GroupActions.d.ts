import type { Actions } from '../../javascript/app/store/actions';
import type { SerializableImageGroup } from '../ImageGroup';

export interface AddImageGroupAction {
  type: Actions.ADD_IMAGE_GROUP,
  payload: {
    group: SerializableImageGroup,
    parentId: string,
  },
}

export interface SetImageGroupsAction {
  type: Actions.SET_IMAGE_GROUPS,
  payload: SerializableImageGroup[],
}

export interface DeleteImageGroupAction {
  type: Actions.DELETE_IMAGE_GROUP,
  payload: string,
}

// export interface UpdateImageGroupsAction {
//   type: Actions.UPDATE_IMAGE_GROUPS,
//   payload: ImageGroup[],
// }
