'use client';

import React, { createContext, useContext } from 'react';
import { type PropsWithChildren } from 'react';
import { useContextHook, UseNavigationTools } from '@/contexts/NavigationToolsContext/hook';

const NavigationToolsContext = createContext<UseNavigationTools | null>(null);

export function NavigationToolsProvider({ children }: PropsWithChildren) {
  const value = useContextHook();
  return (
    <NavigationToolsContext.Provider value={value}>
      {children}
    </NavigationToolsContext.Provider>
  );
}

export const useNavigationTools = () => {
  const context = useContext(NavigationToolsContext);
  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
