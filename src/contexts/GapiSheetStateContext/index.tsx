'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { GapiSheetStateContextType, useContextHook } from '@/contexts/GapiSheetStateContext/hook';

const gapiSheetStateContext = createContext<GapiSheetStateContextType | null>(null);

export function GapiSheetStateProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <gapiSheetStateContext.Provider value={contextValue}>
      {children}
    </gapiSheetStateContext.Provider>
  );
}

const useGapiSheetState = () => {
  const context = useContext(gapiSheetStateContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};

export default useGapiSheetState;
