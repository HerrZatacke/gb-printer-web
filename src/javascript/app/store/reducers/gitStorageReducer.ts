/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { GitStorageAction } from '../../../../types/actions/StorageActions';
import { GitStorageSettings } from '../../../../types/Sync';

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
