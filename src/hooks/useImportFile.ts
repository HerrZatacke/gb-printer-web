import { useCallback, useMemo } from 'react';
import useInteractionsStore from '@/stores/interactionsStore';
import getHandleFileImport, { type HandeFileImportFn, type HandeFileImportOptions } from '@/tools/getHandleFileImport';
import { useImportExportSettings } from './useImportExportSettings';

interface UseImportFile {
  handleFileImport: HandeFileImportFn,
}

const useImportFile = (): UseImportFile => {
  const { setError } = useInteractionsStore.getState();
  const { jsonImport } = useImportExportSettings();

  const handleFileImportJson = useMemo(() => getHandleFileImport(jsonImport), [jsonImport]);

  const handleFileImport = useCallback(async (files: File[], options?: HandeFileImportOptions): Promise<void> => {
    try {
      await handleFileImportJson(files, options);
    } catch (error) {
      setError(error as Error);
    }
  }, [handleFileImportJson, setError]);

  return {
    handleFileImport,
  };
};


export default useImportFile;
