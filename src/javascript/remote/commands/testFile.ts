import { PrinterTestFile } from '../../../types/Printer';

const testFile = async (): Promise<PrinterTestFile> => {
  const { default: lines } = await import(/* webpackChunkName: "dmy" */ '../../app/components/Import/dummy');
  return { lines };
};

export default testFile;
