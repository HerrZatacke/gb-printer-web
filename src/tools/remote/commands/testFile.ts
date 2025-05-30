import dummyImage from '@/components/Import/dummy';
import type { PrinterTestFile } from '@/types/Printer';

const testFile = async (): Promise<PrinterTestFile> => {
  return { lines: dummyImage };
};

export default testFile;
