/* eslint-disable default-param-last */
import { Actions } from '../actions';

export interface GitStorageSettings {
  use?: boolean,
  owner?: string,
  repo?: string,
  branch?: string,
  token?: string,
  throttle?: number,
}

interface GitStorageAction {
  type: Actions.SET_GIT_STORAGE,
  payload: GitStorageSettings
}

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
