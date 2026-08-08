import { type ExportTypes } from '@/consts/exportTypes';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import useImportFile from '@/hooks/useImportFile';

interface UseImport {
  importPlainText: (textDump: string) => void;
  importFiles: (files: File[]) => void;
  exportJson: (what: ExportTypes) => void;
}

export const useImport = (): UseImport => {
  const { downloadSettings } = useImportExportSettings();
  const { handleFileImport } = useImportFile();

  return {
    importPlainText: (textDump) => {
      const file = new File([...textDump], 'Text input.txt', { type: 'text/plain' });
      handleFileImport([file]);
    },
    importFiles: handleFileImport,
    exportJson: (what: ExportTypes) => downloadSettings(what),
  };
};
