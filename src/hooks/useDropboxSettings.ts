import { useMemo } from 'react';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useStores } from '@/hooks/useStores';
import { useStoragesStore } from '@/stores/stores';
import { dropboxStorageTool } from '@/tools/dropboxStorage';
import type { DropBoxSettings } from '@/types/Sync';

interface UseDropboxSettings {
  use: boolean,
  loggedIn: boolean,
  path: string,
  autoDropboxSync: boolean,
  debugText: string,
  logout: () => void,
  setDropboxStorage: (dropboxStorage: DropBoxSettings) => void,
  startAuth: () => void,
}

export const useDropboxSettings = (): UseDropboxSettings => {
  const stores = useStores();
  const { remoteImport } = useImportExportSettings();
  const { dropboxStorage, dropboxLogout, setDropboxStorage } = useStoragesStore();

  const debugText = useMemo(() => {
    const debugObject: Record<string, string | boolean | number | null> = { ...dropboxStorage };
    debugObject.refreshToken = `length: ${dropboxStorage.refreshToken?.length.toString(10) || null}`;
    debugObject.accessToken = `length: ${dropboxStorage.accessToken?.length.toString(10) || null}`;
    return (
      JSON.stringify(debugObject, null, 2)
    );
  }, [dropboxStorage]);

  return {
    use: !!dropboxStorage.use,
    loggedIn: !!dropboxStorage.refreshToken,
    path: dropboxStorage.path || '',
    autoDropboxSync: dropboxStorage?.autoDropboxSync || false,
    debugText,
    logout: dropboxLogout,
    setDropboxStorage,
    startAuth: () => (
      dropboxStorageTool(stores, remoteImport).startAuth()
    ),
  };
};
