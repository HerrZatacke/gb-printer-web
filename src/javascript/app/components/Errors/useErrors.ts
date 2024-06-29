import { useDispatch, useSelector } from 'react-redux';
import type { State } from '../../store/State';
import type { DismissErrorAction } from '../../../../types/actions/GlobalActions';
import { Actions } from '../../store/actions';

export interface ErrorMessage {
  error: Error
  timestamp: number,
}

interface UseErrors {
  errors: ErrorMessage[],
  dismissError: (index: number) => void}

export const useErrors = (): UseErrors => {
  const errors = useSelector((state: State) => state.errors);
  const dispatch = useDispatch();

  return {
    errors,
    dismissError: (index: number) => {
      dispatch<DismissErrorAction>({
        type: Actions.DISMISS_ERROR,
        payload: index,
      });
    },
  };
};
