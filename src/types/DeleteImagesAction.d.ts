import { Actions } from '../javascript/app/store/actions';

export interface DeleteImagesAction {
  type: Actions.DELETE_IMAGES,
  payload: string[],
}
