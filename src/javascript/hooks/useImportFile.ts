import { useMemo } from 'react';
import { useStore } from 'react-redux';
import useInteractionsStore from '../app/stores/interactionsStore';
import getHandleFileImport from '../tools/getHandleFileImport';
import type { HandeFileImportFn, HandeFileImportOptions } from '../tools/getHandleFileImport';
import type { TypedStore } from '../app/store/State';

interface UseImportFile {
  handleFileImport: HandeFileImportFn,
}

const useImportFile = (): UseImportFile => {
  const { setError } = useInteractionsStore.getState();
  const store: TypedStore = useStore();
  const handleFileImport = useMemo<HandeFileImportFn>(() => getHandleFileImport(store), [store]);

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
