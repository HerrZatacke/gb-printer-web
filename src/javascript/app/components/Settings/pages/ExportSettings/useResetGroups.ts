import { useDispatch } from 'react-redux';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../../../types/actions/ConfirmActions';
import type { SetImageGroupsAction } from '../../../../../../types/actions/GroupActions';
import { Actions } from '../../../../store/actions';
import { DialoqQuestionType } from '../../../../../../types/Dialog';

interface UseResetGroups {
  resetGroups: () => void,
}

export const useResetGroups = (): UseResetGroups => {
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
  };
};
