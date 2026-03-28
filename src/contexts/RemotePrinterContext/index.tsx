'use client';

import { createContext, useContext } from 'react';
import { type PropsWithChildren } from 'react';
import { RemotePrinterContextValue, useContextHook } from '@/contexts/RemotePrinterContext/hook';

const remotePrinterContext = createContext<RemotePrinterContextValue | null>(null);

function RemotePrinterContextProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <remotePrinterContext.Provider value={contextValue}>
      { children }
    </remotePrinterContext.Provider>
  );
}

export default RemotePrinterContextProvider;

export const useRemotePrinterContext = (): RemotePrinterContextValue => {
  const context = useContext(remotePrinterContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
