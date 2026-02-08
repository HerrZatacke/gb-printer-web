'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { GapiSheetStateContextType, useContextHook } from '@/contexts/GapiSheetStateContext/hook';

const gapiSheetStateContext = createContext<GapiSheetStateContextType>({
  busy: false,
  sheets: [],
  gapiLastRemoteUpdates: null,
});

export function GapiSheetStateProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <gapiSheetStateContext.Provider value={contextValue}>
      {children}
    </gapiSheetStateContext.Provider>
  );
}

const useGapiSync = () => useContext(gapiSheetStateContext);

export default useGapiSync;
