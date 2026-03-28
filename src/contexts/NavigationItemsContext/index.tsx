'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { NavigationItemsContextType, useContextHook } from '@/contexts/NavigationItemsContext/hook';

const navigationItemsContext = createContext<NavigationItemsContextType | null>(null);

export function NavigationItemsProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <navigationItemsContext.Provider value={contextValue}>
      {children}
    </navigationItemsContext.Provider>
  );
}

export const useNavigationItems = (): NavigationItemsContextType => {
  const context = useContext(navigationItemsContext);
  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
