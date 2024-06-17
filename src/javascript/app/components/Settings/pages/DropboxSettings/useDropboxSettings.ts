import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../../store/actions';
import { State } from '../../../../store/State';
import {
  DropboxLogoutAction,
  DropboxSetStorageAction,
  DropboxStartAuthAction,
} from '../../../../../../types/actions/StorageActions';
import { DropBoxSettings } from '../../../../../../types/Sync';

interface UseDropboxSettings {
  use: boolean,
  loggedIn: boolean,
  path: string,
  autoDropboxSync: boolean,
  logout: () => void,
  setDropboxStorage: (dropboxStorage: DropBoxSettings) => void,
  startAuth: () => void,
}

export const useDropboxSettings = (): UseDropboxSettings => {
  const dbSettings = useSelector((state: State) => ({
    use: !!state.dropboxStorage.use,
    loggedIn: !!state.dropboxStorage.refreshToken,
    path: state.dropboxStorage.path || '',
    autoDropboxSync: state.dropboxStorage?.autoDropboxSync || false,
  }));

  const dispatch = useDispatch();

  return {
    ...dbSettings,
    logout: () => {
      dispatch<DropboxLogoutAction>({
        type: Actions.DROPBOX_LOGOUT,
      });
    },
    setDropboxStorage: (dropboxStorage: DropBoxSettings) => {
      dispatch<DropboxSetStorageAction>({
        type: Actions.SET_DROPBOX_STORAGE,
        payload: dropboxStorage,
      });
    },
    startAuth: () => {
      dispatch<DropboxStartAuthAction>({
        type: Actions.DROPBOX_START_AUTH,
      });
    },
  };
};
