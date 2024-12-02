import type { DropBoxSettings } from '../../../../../../types/Sync';
import useStoragesStore from '../../../../stores/storagesStore';
import { dropboxStorageTool } from '../../../../../tools/dropboxStorage';
import { useStores } from '../../../../../hooks/useStores';
import { useImportExportSettings } from '../../../../../hooks/useImportExportSettings';

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
  const stores = useStores();
  const { remoteImport } = useImportExportSettings();
  const { dropboxStorage, dropboxLogout, setDropboxStorage } = useStoragesStore();

  return {
    use: !!dropboxStorage.use,
    loggedIn: !!dropboxStorage.refreshToken,
    path: dropboxStorage.path || '',
    autoDropboxSync: dropboxStorage?.autoDropboxSync || false,
    logout: dropboxLogout,
    setDropboxStorage,
    startAuth: () => (
      dropboxStorageTool(stores, remoteImport).startAuth()
    ),
  };
};
