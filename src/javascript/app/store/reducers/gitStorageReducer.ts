/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { GitStorageAction, GitStorageSettings } from '../../../../types/actions/StorageActions';

const gitStorageReducer = (value: GitStorageSettings = {}, action: GitStorageAction): GitStorageSettings => {
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
