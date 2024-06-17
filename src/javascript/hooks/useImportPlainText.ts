import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../app/store/actions';
import { ImportFilesAction } from '../../types/actions/ImportActions';

const useImportPlainText = () => {
  const dispatch = useDispatch();
  const importPlainText = useCallback((textDump: string) => {
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
  }, [dispatch]);

  return importPlainText;
};

export default useImportPlainText;
