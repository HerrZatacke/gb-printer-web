import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../app/store/actions';

const useImportPlainText = () => {
  const dispatch = useDispatch();
  const importPlainText = useCallback((textDump: string) => {
    let file;
    try {
      file = new File([...textDump], 'Text input.txt', { type: 'text/plain' });
    } catch (error) {
      file = new Blob([...textDump], { type: 'text/plain' });
    }

    dispatch({
      type: Actions.IMPORT_FILES,
      payload: { files: [file] },
    });
  }, [dispatch]);

  return importPlainText;
};

export default useImportPlainText;
