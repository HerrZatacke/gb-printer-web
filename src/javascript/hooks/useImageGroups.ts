import { useDispatch } from 'react-redux';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../types/actions/ConfirmActions';
import type {
  SetImageGroupsAction,
  DeleteImageGroupAction,
  EditImageGroupAction,
} from '../../types/actions/GroupActions';
import { Actions } from '../app/store/actions';
import { DialoqQuestionType } from '../../types/Dialog';
import { useGalleryTreeContext } from '../app/contexts/galleryTree';
import { NEW_GROUP } from '../app/components/Overlays/EditImageGroup/useEditImageGroup';


interface UseImageGroups {
  resetGroups: () => void,
  createGroup: (hash: string, imageTitle?: string) => void,
  editGroup: (id: string) => void,
  deleteGroup: (id: string) => void,
}

export const useImageGroups = (): UseImageGroups => {
  const { view } = useGalleryTreeContext();
  const dispatch = useDispatch();

  return {
    resetGroups: () => {
      dispatch<ConfirmAskAction>({
        type: Actions.CONFIRM_ASK,
        payload: {
          message: 'Reset image groups?',
          questions: () => [{
            key: 'info',
            type: DialoqQuestionType.INFO,
            label: 'This will remove ALL your created groups and all existing images will be moved to the top level.',
          }],
          confirm: async () => {
            dispatch<ConfirmAnsweredAction>({
              type: Actions.CONFIRM_ANSWERED,
            });
            dispatch<SetImageGroupsAction>({
              type: Actions.SET_IMAGE_GROUPS,
              payload: [],
            });
          },
          deny: async () => {
            dispatch<ConfirmAnsweredAction>({
              type: Actions.CONFIRM_ANSWERED,
            });
          },
        },
      });
    },
    createGroup: (hash: string, imageTitle?: string) => {
      dispatch<EditImageGroupAction>({
        type: Actions.EDIT_IMAGE_GROUP,
        payload: {
          groupId: NEW_GROUP,
          newGroupCover: hash,
          newGroupTitle: imageTitle?.trim() ? `Group - ${imageTitle}` : 'New group',
        },
      });
    },
    editGroup: (id: string) => {
      dispatch<EditImageGroupAction>({
        type: Actions.EDIT_IMAGE_GROUP,
        payload: {
          groupId: id,
        },
      });
    },
    deleteGroup: (id: string) => {
      const deleteGroup = view.groups.find((group) => group.id === id);
      if (!deleteGroup) {
        return;
      }

      dispatch<ConfirmAskAction>({
        type: Actions.CONFIRM_ASK,
        payload: {
          message: 'Delete image group?',
          questions: () => [{
            key: 'info',
            type: DialoqQuestionType.INFO,
            label: `This will delete this group "${deleteGroup.title || deleteGroup.slug}" and move all children (images & groups) to the current level.`,
          }],
          confirm: async () => {
            dispatch<ConfirmAnsweredAction>({
              type: Actions.CONFIRM_ANSWERED,
            });
            dispatch<DeleteImageGroupAction>({
              type: Actions.DELETE_IMAGE_GROUP,
              payload: id,
            });
          },
          deny: async () => {
            dispatch<ConfirmAnsweredAction>({
              type: Actions.CONFIRM_ANSWERED,
            });
          },
        },
      });
    },
  };
};
