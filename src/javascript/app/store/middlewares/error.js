import { Actions } from '../actions';

const handleErrors = () => (next) => (action) => {

  if (action.type === Actions.ERROR) {
    // eslint-disable-next-line no-alert
    alert(action.payload);
  }

  next(action);
};

export default handleErrors;
