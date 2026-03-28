import { createContext, useContext } from 'react';
import { PortsContextValue } from '@/types/ports';

export const portsContext = createContext<PortsContextValue | null>(null);

export const usePortsContext = (): PortsContextValue => {
  const context = useContext(portsContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
