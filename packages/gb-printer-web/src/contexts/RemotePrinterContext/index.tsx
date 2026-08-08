'use client';

import { createContext, useContext, type PropsWithChildren } from 'react';
import { RemotePrinterContextValue, useContextHook } from '@/contexts/RemotePrinterContext/hook';

const remotePrinterContext = createContext<RemotePrinterContextValue | null>(null);

export function RemotePrinterProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <remotePrinterContext.Provider value={contextValue}>
      { children }
    </remotePrinterContext.Provider>
  );
}

export const useRemotePrinterContext = (): RemotePrinterContextValue => {
  const context = useContext(remotePrinterContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
