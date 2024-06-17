/* eslint-disable default-param-last */
import uniqueBy from '../../../tools/unique/by';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { Frame } from '../../../../types/Frame';
import { AddFrameAction, DeleteFrameAction, UpdateFrameAction } from '../../../../types/actions/FrameActions';
import sortBy from '../../../tools/sortby';

const uniqueById = uniqueBy<Frame>('id');
const sortById = sortBy<Frame>('id');

const framesReducer = (
  frames: Frame[] = [],
  action: AddFrameAction | UpdateFrameAction | DeleteFrameAction | GlobalUpdateAction,
): Frame[] => {
  switch (action.type) {
    case Actions.ADD_FRAME:
      return action.payload ? sortById(uniqueById([action.payload.frame, ...frames])) : frames;
    case Actions.DELETE_FRAME:
      return frames.filter(({ id }) => id !== action.payload);
    case Actions.UPDATE_FRAME:
      return sortById([
        ...frames.filter(({ id }) => id !== action.payload.updateId),
        action.payload.data,
      ]);
    case Actions.GLOBAL_UPDATE:
      if (!action.payload?.frames) {
        return frames;
      }

      return sortById(uniqueById(action.payload?.frames || []));
    default:
      return frames;
  }
};

export default framesReducer;
