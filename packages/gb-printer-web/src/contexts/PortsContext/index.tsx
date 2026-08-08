'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { useContextHook } from '@/contexts/PortsContext/hook';
import { PortsContextValue } from '@/types/ports';

export const portsContext = createContext<PortsContextValue | null>(null);

export function PortsProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <portsContext.Provider value={contextValue}>
      { children }
    </portsContext.Provider>
  );
}

export const usePortsContext = (): PortsContextValue => {
  const context = useContext(portsContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
