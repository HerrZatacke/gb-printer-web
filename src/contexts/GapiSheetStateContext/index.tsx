'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { GapiSheetStateContextType, useContextHook } from '@/contexts/GapiSheetStateContext/hook';

const gapiSheetStateContext = createContext<GapiSheetStateContextType>({
  busy: false,
  sheets: [],
  gapiLastRemoteUpdates: null,
  updateSheets: async () => {},
});

export function GapiSheetStateProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <gapiSheetStateContext.Provider value={contextValue}>
      {children}
    </gapiSheetStateContext.Provider>
  );
}

const useGapiSheetState = () => useContext(gapiSheetStateContext);

export default useGapiSheetState;
