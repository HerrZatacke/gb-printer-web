import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { IMPORT_FILES } from '../app/store/actions';

const useImportPlainText = () => {
  const dispatch = useDispatch();
  const importPlainText = useRef((textDump) => {
    let file;
    try {
      file = new File([...textDump], 'Text input.txt', { type: 'text/plain' });
    } catch (error) {
      file = new Blob([...textDump], { type: 'text/plain' });
    }

    dispatch({
      type: IMPORT_FILES,
      payload: { files: [file] },
    });
  });

  return importPlainText.current;
};

export default useImportPlainText;
