import getHandleFileImport, { HandeFileImportFn } from '../../../tools/getHandleFileImport';
import { Actions } from '../actions';
import { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import { ErrorAction } from '../../../../types/actions/GlobalActions';

const importFile: MiddlewareWithState = (store) => {
  const handleFileImport: HandeFileImportFn = getHandleFileImport(store);

  return (next) => async (action): Promise<void> => {
    if (action.type === Actions.IMPORT_FILES) {

      if (action.payload.files && action.payload.files.length) {
        try {
          await handleFileImport([...action.payload.files], {
            fromPrinter: action.payload.fromPrinter || false,
          });
        } catch (error) {
          store.dispatch<ErrorAction>({
            type: Actions.ERROR,
            payload: (error as Error).message,
          });
        }
      }

      // don't call next(action)
      return;
    }

    next(action);
  };
};


export default importFile;
