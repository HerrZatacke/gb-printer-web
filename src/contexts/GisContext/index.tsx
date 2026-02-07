'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { GISContextType, useContextHook } from '@/contexts/GisContext/hook';

const gisContext = createContext<GISContextType>({
  isSignedIn: false,
  handleSignIn: async () => {},
  handleSignOut: async () => {},
});

export function GISProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <gisContext.Provider value={contextValue}>
      {children}
    </gisContext.Provider>
  );
}

const useGIS = () => useContext(gisContext);

export default useGIS;
