import getHandleFileImport from '../../../tools/getHandleFileImport';
import { Actions } from '../actions';

const importFile = (store) => {
  const handleFileImport = getHandleFileImport(store);

  return (next) => (action) => {
    if (action.type === Actions.IMPORT_FILES) {

      if (action.payload.files && action.payload.files.length) {
        const importFiles = async () => {
          try {
            await handleFileImport([...action.payload.files], {
              fromPrinter: action.payload.fromPrinter || false,
            });
          } catch (error) {
            store.dispatch({
              type: Actions.ERROR,
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
