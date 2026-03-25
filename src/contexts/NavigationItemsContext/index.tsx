'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';
import { NavigationItemsContextType, useContextHook } from '@/contexts/NavigationItemsContext/hook';

const navigationItemsContext = createContext<NavigationItemsContextType>({
  mainNavigationItems: [],
  mainNavigationActionItems: [],
  settingsTabs: [],
});

export function NavigationItemsProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <navigationItemsContext.Provider value={contextValue}>
      {children}
    </navigationItemsContext.Provider>
  );
}

const useNavigationItems = () => useContext(navigationItemsContext);

export default useNavigationItems;
