import type { Actions } from '../../javascript/app/store/actions';
import type { ImageGroup } from '../ImageGroup';

export interface AddImageGroupAction {
  type: Actions.ADD_IMAGE_GROUP,
  payload: ImageGroup,
}

export interface DeleteImageGroupAction {
  type: Actions.DELETE_IMAGE_GROUP,
  payload: string,
}

// export interface UpdateImageGroupsAction {
//   type: Actions.UPDATE_IMAGE_GROUPS,
//   payload: ImageGroup[],
// }
