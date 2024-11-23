import { useStore } from 'react-redux';
import { importExportSettings } from '../../../tools/importExportSettings';
import useInteractionsStore from '../../stores/interactionsStore';
import useSettingsStore from '../../stores/settingsStore';
import type { ExportTypes } from '../../../consts/exportTypes';
import type { TypedStore } from '../../store/State';
import useImportFile from '../../../hooks/useImportFile';

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
  const store: TypedStore = useStore();
  const { downloadSettings } = importExportSettings(store);

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
