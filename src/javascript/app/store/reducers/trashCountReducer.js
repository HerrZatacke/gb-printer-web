/* eslint-disable default-param-last */
import { Actions } from '../actions';

const trashCountReducer = (value = { frames: 0, images: 0, show: false }, action) => {
  switch (action.type) {
    case Actions.SHOW_HIDE_TRASH:
      return {
        ...value,
        show: action.payload,
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
