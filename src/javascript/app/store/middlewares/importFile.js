import getHandleFileImport from '../../../tools/getHandleFileImport';
import { ERROR, IMPORT_FILES } from '../actions';

const importFile = (store) => {
  const handleFileImport = getHandleFileImport(store);

  return (next) => (action) => {
    if (action.type === IMPORT_FILES) {

      if (action.payload.files && action.payload.files.length) {
        const importFiles = async () => {
          try {
            await handleFileImport([...action.payload.files], {
              fromPrinter: action.payload.fromPrinter || false,
            });
          } catch (error) {
            store.dispatch({
              type: ERROR,
              payload: error.message,
            });
          }
        };

        importFiles();
      }

      // don't call next(action)
      return;
    }

    next(action);
  };
};


export default importFile;
