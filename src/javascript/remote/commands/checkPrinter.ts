import { CheckPrinterStatus, PrinterInfo } from '../../../types/Printer';

const checkPrinter = async (): Promise<CheckPrinterStatus> => {
  const res = await fetch('/dumps/list');
  const data = await res.json() as PrinterInfo;

  if (data.fs && (data.fs.dumpcount !== data.dumps.length)) {
    throw new Error('Inconststent image count received from printer.');
  }

  return {
    printerData: {
      ...data,
      dumps: [...data.dumps].sort(),
    },
  };
};

export default checkPrinter;
