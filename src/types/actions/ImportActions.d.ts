import { Actions } from '../../javascript/app/store/actions';
import { NamedFile } from '../Printer';

export interface ImportFilesAction {
  type: Actions.IMPORT_FILES,
  payload: {
    files: (NamedFile | File | Blob)[],
    fromPrinter?: boolean,
  },
}
