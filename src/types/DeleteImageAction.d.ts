import { Actions } from '../javascript/app/store/actions';

export interface DeleteImageAction {
  type: Actions.DELETE_IMAGE,
  payload: string,
}
