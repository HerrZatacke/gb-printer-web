import { useMemo } from 'react';
import useInteractionsStore from '../app/stores/interactionsStore';
import getHandleFileImport from '../tools/getHandleFileImport';
import { useImportExportSettings } from './useImportExportSettings';
import type { HandeFileImportFn, HandeFileImportOptions } from '../../types/handleFileImport';

interface UseImportFile {
  handleFileImport: HandeFileImportFn,
}

const useImportFile = (): UseImportFile => {
  const { setError } = useInteractionsStore.getState();
  const { jsonImport } = useImportExportSettings();

  const handleFileImport = useMemo(() => (getHandleFileImport(jsonImport)), [jsonImport]);

  return {
    handleFileImport: async (files: File[], options?: HandeFileImportOptions): Promise<void> => {
      try {
        await handleFileImport(files, options);
      } catch (error) {
        setError(error as Error);
      }
    },
  };
};


export default useImportFile;
