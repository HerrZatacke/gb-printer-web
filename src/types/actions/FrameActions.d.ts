import { Actions } from '../../javascript/app/store/actions';
import { Frame } from '../Frame';

export interface AddFrameAction {
  type: Actions.ADD_FRAME,
  payload?: Frame,
}

export interface UpdateFrameAction {
  type: Actions.UPDATE_FRAME,
  payload: {
    updateId: string,
    data: Frame,
  }
}

export interface DeleteFrameAction {
  type: Actions.DELETE_FRAME,
  payload: string,
}
