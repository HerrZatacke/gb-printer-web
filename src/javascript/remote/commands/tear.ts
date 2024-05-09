import checkPrinter from './checkPrinter';
import { CheckPrinterStatus } from '../../../types/Printer';

const clearPrinter = async (): Promise<CheckPrinterStatus> => {
  const res = await fetch('/reset');
  const { result } = await res.json();

  try {
    if (result === 'ok') {
      return checkPrinter();
    }
  } catch (error) { /**/ }

  throw new Error('error while deleting images');
};

export default clearPrinter;
