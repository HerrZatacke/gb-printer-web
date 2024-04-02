/* eslint-disable default-param-last */
import { Actions } from '../actions';

const gitStorageReducer = (value = {}, action) => {
  switch (action.type) {
    case Actions.SET_GIT_STORAGE:
      return {
        ...value,
        ...action.payload,
      };
    default:
      return value;
  }
};

export default gitStorageReducer;
