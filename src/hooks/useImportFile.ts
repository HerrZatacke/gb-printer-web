import { useCallback, useMemo } from 'react';
import useTracking from '@/contexts/TrackingContext';
import { useInteractionsStore } from '@/stores/stores';
import { concatImportResults } from '@/tools/concatImportResults';
import getHandleFileImport, { type HandeFileImportFn, type HandeFileImportOptions } from '@/tools/getHandleFileImport';
import { ImportResult } from '@/types/ImportItem';
import { useImportExportSettings } from './useImportExportSettings';

interface UseImportFile {
  handleFileImport: HandeFileImportFn,
}

const useImportFile = (): UseImportFile => {
  const { setError } = useInteractionsStore.getState();
  const { jsonImport } = useImportExportSettings();
  const { sendEvent } = useTracking();

  const handleFileImportFn = useMemo(() => getHandleFileImport(jsonImport), [jsonImport]);

  const handleFileImport = useCallback(async (files: File[], options?: HandeFileImportOptions): Promise<ImportResult[]> => {
    try {
      const importResults = await handleFileImportFn(files, options);
      sendEvent('importQueue', concatImportResults(importResults, 'fileImport'));
      return importResults;
    } catch (error) {
      setError(error as Error);
      return [];
    }
  }, [handleFileImportFn, sendEvent, setError]);

  return {
    handleFileImport,
  };
};


export default useImportFile;
