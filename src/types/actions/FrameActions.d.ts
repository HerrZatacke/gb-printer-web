import type { Actions } from '../../javascript/app/store/actions';
import type { Frame } from '../Frame';
import type { FrameGroup } from '../FrameGroup';

export interface AddFrameAction {
  type: Actions.ADD_FRAME,
  payload?: {
    tempId: string,
    frame: Frame
  },
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


export interface FrameGroupNamesAction {
  type: Actions.NAME_FRAMEGROUP,
  payload: FrameGroup,
}
