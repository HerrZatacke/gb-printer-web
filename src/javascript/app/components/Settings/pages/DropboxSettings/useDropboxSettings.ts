import { useStore } from 'react-redux';
import type { TypedStore } from '../../../../store/State';
import type { DropBoxSettings } from '../../../../../../types/Sync';
import useStoragesStore from '../../../../stores/storagesStore';
import { dropboxStorageTool } from '../../../../../tools/dropboxStorage';

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
  const store: TypedStore = useStore();
  const { dropboxStorage, dropboxLogout, setDropboxStorage } = useStoragesStore();

  return {
    use: !!dropboxStorage.use,
    loggedIn: !!dropboxStorage.refreshToken,
    path: dropboxStorage.path || '',
    autoDropboxSync: dropboxStorage?.autoDropboxSync || false,
    logout: dropboxLogout,
    setDropboxStorage,
    startAuth: () => (
      dropboxStorageTool(store).startAuth()
    ),
  };
};
