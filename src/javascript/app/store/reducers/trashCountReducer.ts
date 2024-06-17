/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  TrashCountFramesAction,
  TrashCountImagesAction,
  TrashShowHideAction,
} from '../../../../types/actions/TrashActions';

export interface TrashCount {
  frames: number,
  images: number,
  show: boolean,
}

const trashCountReducer = (
  value: TrashCount = { frames: 0, images: 0, show: false },
  action:
    TrashCountImagesAction |
    TrashCountFramesAction |
    TrashShowHideAction,
): TrashCount => {
  switch (action.type) {
    case Actions.SHOW_HIDE_TRASH:
      return {
        ...value,
        show: !!action.payload,
      };
    case Actions.SET_TRASH_COUNT_FRAMES:
      return {
        ...value,
        frames: action.payload,
      };
    case Actions.SET_TRASH_COUNT_IMAGES:
      return {
        ...value,
        images: action.payload,
      };
    default:
      return value;
  }
};

export default trashCountReducer;
