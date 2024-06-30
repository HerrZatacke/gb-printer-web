import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import type { State } from '../app/store/State';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../types/actions/ConfirmActions';
import type {
  SetImageGroupsAction,
  AddImageGroupAction,
  DeleteImageGroupAction,
  EditImageGroupAction,
} from '../../types/actions/GroupActions';
import { Actions } from '../app/store/actions';
import type { DialogResult } from '../../types/Dialog';
import { DialoqQuestionType } from '../../types/Dialog';
import { randomId } from '../tools/randomId';
import { dateFormat } from '../app/defaults';
import { useGalleryTreeContext } from '../app/contexts/galleryTree';


interface UseImageGroups {
  resetGroups: () => void,
  createGroup: (hash: string, imageTitle?: string) => void,
  editGroup: (id: string) => void,
  deleteGroup: (id: string) => void,
}

export const useImageGroups = (): UseImageGroups => {
  const { view } = useGalleryTreeContext();
  const dispatch = useDispatch();

  const {
    selection,
  } = useSelector((state: State) => ({
    selection: state.imageSelection,
  }));


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
      dispatch<ConfirmAskAction>({
        type: Actions.CONFIRM_ASK,
        payload: {
          message: 'Create new image group',
          questions: () => [
            {
              key: 'title',
              type: DialoqQuestionType.TEXT,
              label: 'Title / Description',
              initialValue: imageTitle?.trim() ? `Group - ${imageTitle}` : 'New group',
            },
            {
              key: 'slug',
              type: DialoqQuestionType.TEXT,
              label: 'Pathsegment / Identifier',
            },
          ],
          confirm: async (values: DialogResult) => {
            dispatch<ConfirmAnsweredAction>({
              type: Actions.CONFIRM_ANSWERED,
            });

            const slug = (values.slug as string)?.trim() || '';
            const title = (values.title as string)?.trim() || '';

            if (!slug) {
              return;
            }

            dispatch<AddImageGroupAction>({
              type: Actions.ADD_IMAGE_GROUP,
              payload: {
                parentId: view.id,
                group: {
                  id: randomId(),
                  slug,
                  title,
                  created: dayjs(Date.now()).format(dateFormat),
                  coverImage: hash,
                  images: selection,
                  groups: [],
                },
              },
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
    editGroup: (id: string) => {
      dispatch<EditImageGroupAction>({
        type: Actions.EDIT_IMAGE_GROUP,
        payload: id,
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
