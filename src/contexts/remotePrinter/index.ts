import { createContext, useContext } from 'react';
import { type PrinterFunction } from '@/consts/printerFunction';

export interface RemotePrinterContext {
  callRemoteFunction: (functionType: PrinterFunction) => Promise<void>,
}

export const remotePrinterContext = createContext<RemotePrinterContext | null>(null);

export const useRemotePrinterContext = (): RemotePrinterContext => {
  const context = useContext(remotePrinterContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
