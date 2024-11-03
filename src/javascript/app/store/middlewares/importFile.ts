import useInteractionsStore from '../../stores/interactionsStore';
import type { HandeFileImportFn } from '../../../tools/getHandleFileImport';
import getHandleFileImport from '../../../tools/getHandleFileImport';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';

const importFile: MiddlewareWithState = (store) => {
  const handleFileImport: HandeFileImportFn = getHandleFileImport(store);
  const { setError } = useInteractionsStore.getState();

  return (next) => async (action): Promise<void> => {
    if (action.type === Actions.IMPORT_FILES) {

      if (action.payload.files && action.payload.files.length) {
        try {
          await handleFileImport([...action.payload.files], {
            fromPrinter: action.payload.fromPrinter || false,
          });
        } catch (error) {
          setError(error as Error);
        }
      }

      // don't call next(action)
      return;
    }

    next(action);
  };
};


export default importFile;
