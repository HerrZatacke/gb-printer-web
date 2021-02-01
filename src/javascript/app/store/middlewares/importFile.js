import getHandleFileImport from '../../../tools/getHandleFileImport';

const importFile = (store) => {
  const handleFileImport = getHandleFileImport(store);

  return (next) => (action) => {
    if (action.type === 'IMPORT_FILE') {

      if (action.payload.files && action.payload.files.length === 1) {
        handleFileImport(action.payload.files[0]);
      }

      // don't call next(action)
      return;
    }

    next(action);
  };
};


export default importFile;
