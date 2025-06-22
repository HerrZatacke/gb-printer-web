'use client';

import React, { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import { type UseNavigationTools, useNavigationTools } from './index';

const NavigationToolsContext = createContext<UseNavigationTools | null>(null);

export function NavigationToolsProvider({ children }: PropsWithChildren) {
  const value = useNavigationTools();
  return (
    <NavigationToolsContext.Provider value={value}>
      {children}
    </NavigationToolsContext.Provider>
  );
}

export const useNavigationToolsContext = () => {
  const context = useContext(NavigationToolsContext);
  if (!context) {
    throw new Error('useNavigationToolsContext must be used within an NavigationToolsProvider');
  }

  return context;
};
