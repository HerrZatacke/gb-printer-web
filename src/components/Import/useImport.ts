import type { ExportTypes } from '@/consts/exportTypes';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import useImportFile from '@/hooks/useImportFile';
import { useInteractionsStore, useSettingsStore } from '@/stores/stores';

interface UseImport {
  printerUrl?: string,
  printerConnected: boolean,
  importPlainText: (textDump: string) => void,
  importFiles: (files: File[]) => void,
  exportJson: (what: ExportTypes) => void,
}

export const useImport = (): UseImport => {
  const { printerUrl } = useSettingsStore();
  const { printerFunctions } = useInteractionsStore();
  const { downloadSettings } = useImportExportSettings();

  const fullPrinterUrl = printerUrl ? `${printerUrl}remote.html` : undefined;
  const printerConnected = printerFunctions.length > 0;

  const { handleFileImport } = useImportFile();

  return {
    printerUrl: fullPrinterUrl,
    printerConnected,
    importPlainText: (textDump) => {
      const file = new File([...textDump], 'Text input.txt', { type: 'text/plain' });
      handleFileImport([file]);
    },
    importFiles: handleFileImport,
    exportJson: (what: ExportTypes) => downloadSettings(what),
  };
};
