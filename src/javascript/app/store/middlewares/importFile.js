import getHandleFileImport from '../../../tools/getHandleFileImport';
import { IMPORT_FILES } from '../actions';

const importFile = (store) => {
  const handleFileImport = getHandleFileImport(store);

  return (next) => (action) => {
    if (action.type === IMPORT_FILES) {

      if (action.payload.files && action.payload.files.length) {
        handleFileImport([...action.payload.files], {
          fromPrinter: action.payload.fromPrinter || false,
        });
      }

      // don't call next(action)
      return;
    }

    next(action);
  };
};


export default importFile;
