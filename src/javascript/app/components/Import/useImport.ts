import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import { ExportJSONAction, ExportTypes } from '../../store/defaults';
import { ImportFilesAction } from '../../../../types/actions/ImportActions';

interface UseImport {
  printerUrl?: string,
  printerConnected: boolean,
  importPlainText: (textDump: string) => void,
  importFiles: (files: File[]) => void,
  exportJson: (what: ExportTypes) => void,
}

export const useImport = (): UseImport => {
  const {
    printerUrl,
    printerConnected,
  } = useSelector((state: State) => ({
    printerUrl: state.printerUrl ? `${state.printerUrl}remote.html` : undefined,
    printerConnected: state.printerFunctions.length > 0,
  }));

  const dispatch = useDispatch();

  return {
    printerUrl,
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
