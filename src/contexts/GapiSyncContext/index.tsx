'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { GapiSyncContextType, useContextHook } from '@/contexts/GapiSyncContext/hook';

const gapiSyncContext = createContext<GapiSyncContextType | null>(null);

export function GapiSyncProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <gapiSyncContext.Provider value={contextValue}>
      {children}
    </gapiSyncContext.Provider>
  );
}

export const useGapiSync = (): GapiSyncContextType => {
  const context = useContext(gapiSyncContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
