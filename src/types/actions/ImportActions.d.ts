import type { Actions } from '../../javascript/app/store/actions';
import type { NamedFile } from '../Printer';

export interface ImportFilesAction {
  type: Actions.IMPORT_FILES,
  payload: {
    files: (NamedFile | File | Blob)[],
    fromPrinter?: boolean,
  },
}
