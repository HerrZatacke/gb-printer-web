import { useDispatch, useSelector } from 'react-redux';
import useSettingsStore from '../../stores/settingsStore';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { ExportJSONAction } from '../../../../types/actions/StorageActions';
import type { ExportTypes } from '../../../consts/exportTypes';
import type { ImportFilesAction } from '../../../../types/actions/ImportActions';

interface UseImport {
  printerUrl?: string,
  printerConnected: boolean,
  importPlainText: (textDump: string) => void,
  importFiles: (files: File[]) => void,
  exportJson: (what: ExportTypes) => void,
}

export const useImport = (): UseImport => {
  const { printerUrl } = useSettingsStore();

  const fullPrinterUrl = printerUrl ? `${printerUrl}remote.html` : undefined;

  const {
    printerConnected,
  } = useSelector((state: State) => ({
    printerConnected: state.printerFunctions.length > 0,
  }));

  const dispatch = useDispatch();

  return {
    printerUrl: fullPrinterUrl,
    printerConnected,
    importPlainText: (textDump) => {
      let file;
      try {
        file = new File([...textDump], 'Text input.txt', { type: 'text/plain' });
      } catch (error) {
        file = new Blob([...textDump], { type: 'text/plain' });
      }

      dispatch<ImportFilesAction>({
        type: Actions.IMPORT_FILES,
        payload: { files: [file] },
      });
    },
    importFiles: (files: File[]) => {
      dispatch<ImportFilesAction>({
        type: Actions.IMPORT_FILES,
        payload: { files },
      });
    },
    exportJson: (what: ExportTypes) => {
      dispatch<ExportJSONAction>({
        type: Actions.JSON_EXPORT,
        payload: what,
      });
    },
  };
};
