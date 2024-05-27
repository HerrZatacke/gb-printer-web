/* eslint-disable default-param-last */
import { Actions } from '../actions';
import uniqueBy from '../../../tools/unique/by';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { FrameGroup } from '../../../../types/FrameGroup';
import { FrameGroupNamesAction } from '../../../../types/actions/FrameActions';

const frameGroupNamesReducer = (
  frameGroupNames: FrameGroup[] = [],
  action: FrameGroupNamesAction | GlobalUpdateAction,
): FrameGroup[] => {
  switch (action.type) {
    case Actions.NAME_FRAMEGROUP:
      return uniqueBy<FrameGroup>('id')([
        action.payload,
        ...frameGroupNames,
      ]);
    case Actions.GLOBAL_UPDATE:
      return uniqueBy<FrameGroup>('id')([
        ...(action.payload?.frameGroupNames || []),
        ...frameGroupNames,
      ]);
    default:
      return frameGroupNames;
  }
};

export default frameGroupNamesReducer;
