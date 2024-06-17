import checkPrinter from './checkPrinter';
import { CheckPrinterStatus } from '../../../types/Printer';

const clearPrinter = async (): Promise<CheckPrinterStatus> => {
  const res = await fetch('/dumps/clear');
  const { deleted } = await res.json();

  if (deleted !== undefined) {
    return checkPrinter();
  }

  throw new Error('error while deleting images');
};

export default clearPrinter;
