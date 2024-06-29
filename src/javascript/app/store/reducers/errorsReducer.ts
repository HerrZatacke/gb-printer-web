/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { ErrorMessage } from '../../components/Errors/useErrors';
import type { ErrorAction, DismissErrorAction } from '../../../../types/actions/GlobalActions';

const errorsReducer = (value: ErrorMessage[] = [], action: ErrorAction | DismissErrorAction): ErrorMessage[] => {
  switch (action.type) {
    case Actions.ERROR:
      return action.payload ? [
        ...value,
        action.payload,
      ] : value;
    case Actions.DISMISS_ERROR:
      return value.filter((_, index) => (
        index !== action.payload
      ));
    default:
      return value;
  }
};

export default errorsReducer;
