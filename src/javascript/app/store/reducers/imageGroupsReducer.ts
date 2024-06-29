/* eslint-disable default-param-last */
import { Actions } from '../actions';
import uniqueBy from '../../../tools/unique/by';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { SerializableImageGroup } from '../../../../types/ImageGroup';
import type { AddImageGroupAction, DeleteImageGroupAction, SetImageGroupsAction } from '../../../../types/actions/GroupActions';

const uniqueById = uniqueBy<SerializableImageGroup>('id');

const imageGroupReducer = (
  value: SerializableImageGroup[] = [],
  action:
    AddImageGroupAction |
    SetImageGroupsAction |
    DeleteImageGroupAction |
    GlobalUpdateAction,
): SerializableImageGroup[] => {
  switch (action.type) {
    case Actions.ADD_IMAGE_GROUP: {
      const groups = value.map((group: SerializableImageGroup) => (
        group.id !== action.payload.parentId ? group : {
          ...group,
          groups: [...group.groups, action.payload.group.id],
          images: group.images.filter((hash: string) => !action.payload.group.images.includes(hash)),
        }
      ));
      return uniqueById([...groups, action.payload.group]);
    }

    case Actions.DELETE_IMAGE_GROUP:
      return [...value.filter(({ id }) => id !== action.payload)];
    case Actions.SET_IMAGE_GROUPS:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      if (!action.payload?.imageGroups) {
        return value;
      }

      return uniqueById(action.payload.imageGroups || []);
    default:
      return value;
  }
};

export default imageGroupReducer;
