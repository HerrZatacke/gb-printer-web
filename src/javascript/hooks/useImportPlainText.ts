import { useCallback } from 'react';
import useImportFile from './useImportFile';

const useImportPlainText = () => {
  const { handleFileImport } = useImportFile();
  const importPlainText = useCallback((textDump: string) => {
    const file = new File([...textDump], 'Text input.txt', { type: 'text/plain' });

    handleFileImport([file]);
  }, [handleFileImport]);

  return importPlainText;
};

export default useImportPlainText;
