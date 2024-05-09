import { RemotePrinterParams } from '../../types/Printer';

const getParams = (): RemotePrinterParams => {
  if (window.location.hash?.length <= 1) {
    return {};
  }

  const hash = window.location.hash.slice(1);
  return Object.fromEntries(new URLSearchParams(hash));
};

export default getParams;
