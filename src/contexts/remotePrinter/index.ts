import { createContext, useContext } from 'react';
import type { Context } from 'react';
import type { PrinterFunction } from '@/consts/printerFunction';

export interface RemotePrinterContext {
  callRemoteFunction: (functionType: PrinterFunction) => Promise<void>,
}

export const remotePrinterContext: Context<RemotePrinterContext> = createContext<RemotePrinterContext>({
  callRemoteFunction: async () => { /**/ },
});

export const useRemotePrinterContext = (): RemotePrinterContext => (
  useContext<RemotePrinterContext>(remotePrinterContext)
);
