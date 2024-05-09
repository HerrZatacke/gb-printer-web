import { Actions } from '../actions';
import { MiddlewareWithState } from '../../../../types/MiddlewareWithState';

const handleErrors: MiddlewareWithState = () => (next) => (action) => {

  if (action.type === Actions.ERROR) {
    // eslint-disable-next-line no-alert
    alert(action.payload);
  }

  next(action);
};

export default handleErrors;
