'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { GISContextType, useContextHook } from '@/contexts/GisContext/hook';

const gisContext = createContext<GISContextType | null>(null);

export function GISProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <gisContext.Provider value={contextValue}>
      {children}
    </gisContext.Provider>
  );
}

const useGIS = () => {
  const context = useContext(gisContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};

export default useGIS;
