import type { Actions } from '../../javascript/app/store/actions';
import type { Frame } from '../Frame';

export interface AddFrameAction {
  type: Actions.ADD_FRAME,
  payload?: {
    tempId: string,
    frame: Frame
  },
}
