/* eslint-disable default-param-last */
import { Actions } from '../actions';

const dropboxStorageReducer = (value = {}, action) => {
  switch (action.type) {
    case Actions.DROPBOX_LOGOUT:
      return {
        use: value.use,
      };
    case Actions.SET_DROPBOX_STORAGE:
      return {
        ...value,
        ...action.payload,
      };
    default:
      return value;
  }
};

export default dropboxStorageReducer;
