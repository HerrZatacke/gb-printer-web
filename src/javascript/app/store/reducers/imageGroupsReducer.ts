/* eslint-disable default-param-last */
import { Actions } from '../actions';
import uniqueBy from '../../../tools/unique/by';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { SerializableImageGroup } from '../../../../types/ImageGroup';
import type {
  AddImageGroupAction,
  DeleteImageGroupAction,
  SetImageGroupsAction,
  UpdateImageGroupAction,
} from '../../../../types/actions/GroupActions';

const uniqueById = uniqueBy<SerializableImageGroup>('id');

const imageGroupReducer = (
  value: SerializableImageGroup[] = [],
  action:
    AddImageGroupAction |
    UpdateImageGroupAction |
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

    case Actions.DELETE_IMAGE_GROUP: {
      const deleteGroup = value.find(({ id }) => id === action.payload);

      if (!deleteGroup) {
        return value;
      }

      const groups = value.reduce((
        acc: SerializableImageGroup[],
        reduceGroup: SerializableImageGroup,
      ): SerializableImageGroup[] => {
        if (reduceGroup.id === action.payload) {
          return acc;
        }

        if (reduceGroup.groups.includes(action.payload)) { // group to be deleted is child of reduceGroup
          return [
            ...acc,
            {
              ...reduceGroup,
              images: [...reduceGroup.images, ...deleteGroup.images],
              groups: [...reduceGroup.groups, ...deleteGroup.groups].filter((id) => id !== deleteGroup.id),
            },
          ];
        }

        return [...acc, reduceGroup];
      }, []);

      return groups;
    }

    case Actions.UPDATE_IMAGE_GROUP: {
      return value.map((group) => {
        const updateGroup = { ...group };

        updateGroup.groups = updateGroup.groups.filter((childGroupId) => childGroupId !== action.payload.group.id);

        if (action.payload.parentGroupId === updateGroup.id) {
          updateGroup.groups = [...updateGroup.groups, action.payload.group.id];
        }

        return updateGroup.id === action.payload.group.id ? action.payload.group : updateGroup;
      });
    }

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
