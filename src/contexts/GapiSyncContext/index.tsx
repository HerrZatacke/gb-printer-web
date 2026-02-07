'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { GapiSyncContextType, useContextHook } from '@/contexts/GapiSyncContext/hook';

const gapiSyncContext = createContext<GapiSyncContextType>({
  busy: false,
  sheets: [],
});

export function GapiSyncProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <gapiSyncContext.Provider value={contextValue}>
      {children}
    </gapiSyncContext.Provider>
  );
}

const useGapiSync = () => useContext(gapiSyncContext);

export default useGapiSync;
