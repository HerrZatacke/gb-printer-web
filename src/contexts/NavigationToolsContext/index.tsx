'use client';

import React, { createContext, useContext } from 'react';
import { type PropsWithChildren } from 'react';
import { useContextHook, UseNavigationTools } from '@/contexts/NavigationToolsContext/hook';

const navigationToolsContext = createContext<UseNavigationTools | null>(null);

export function NavigationToolsProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <navigationToolsContext.Provider value={contextValue}>
      {children}
    </navigationToolsContext.Provider>
  );
}

export const useNavigationTools = (): UseNavigationTools => {
  const context = useContext(navigationToolsContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
