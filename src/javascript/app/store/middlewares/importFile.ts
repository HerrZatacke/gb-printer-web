import dayjs from 'dayjs';
import type { HandeFileImportFn } from '../../../tools/getHandleFileImport';
import getHandleFileImport from '../../../tools/getHandleFileImport';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { ErrorAction } from '../../../../types/actions/GlobalActions';

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
            payload: {
              error: error as Error,
              timestamp: dayjs().unix(),
            },
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
