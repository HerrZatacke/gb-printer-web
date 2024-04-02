/* eslint-disable default-param-last */
import { Actions } from '../actions';

interface DropBoxSettings {
  use?: boolean,
  path?: string,
  autoDropboxSync?: boolean,
}

interface DropboxStorageAction {
  type: Actions.DROPBOX_LOGOUT | Actions.SET_DROPBOX_STORAGE,
  payload: DropBoxSettings
}

const dropboxStorageReducer = (value: DropBoxSettings = {}, action: DropboxStorageAction): DropBoxSettings => {
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
