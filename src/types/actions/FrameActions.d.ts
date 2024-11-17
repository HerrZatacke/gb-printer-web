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

export interface FrameGroupNamesAction {
  type: Actions.NAME_FRAMEGROUP,
  payload: FrameGroup,
}
