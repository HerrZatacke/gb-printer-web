/* eslint-disable default-param-last */
import uniqueBy from '../../../tools/unique/by';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { Frame } from '../../../../types/Frame';
import { AddFrameAction, DeleteFrameAction, UpdateFrameAction } from '../../../../types/actions/FrameActions';

const sortFrames = (a: Frame, b: Frame) => {
  if (a.id < b.id) {
    return -1;
  }

  if (a.id > b.id) {
    return 1;
  }

  return 0;
};

const framesReducer = (
  frames = [],
  action: AddFrameAction | UpdateFrameAction | DeleteFrameAction | GlobalUpdateAction,
) => {
  switch (action.type) {
    case Actions.ADD_FRAME:
      return uniqueBy<Frame>('id')([action.payload, ...frames]).sort(sortFrames);
    case Actions.DELETE_FRAME:
      return frames.filter(({ id }) => id !== action.payload);
    case Actions.UPDATE_FRAME:
      return [
        ...frames.filter(({ id }) => id !== action.payload.updateId),
        action.payload.data,
      ].sort(sortFrames);
    case Actions.GLOBAL_UPDATE:
      return uniqueBy<Frame>('id')(action.payload.frames || []).sort(sortFrames);
    default:
      return frames;
  }
};

export default framesReducer;
