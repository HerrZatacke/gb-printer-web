import type { Actions } from '../../javascript/app/store/actions';
import type { PrinterFunction } from '../../javascript/consts/printerFunction';

export interface PrinterRemoteCallAction {
  type: Actions.REMOTE_CALL_FUNCTION,
  payload: PrinterFunction,
}
