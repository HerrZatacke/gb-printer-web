'use client';

import { createContext, type PropsWithChildren, useContext } from 'react';
import { useContextHook } from '@/contexts/PluginsContext/hook';
import { type PluginsContext } from '@/types/Plugin';

const pluginsContext = createContext<PluginsContext | null>(null);

export function PluginsContext({ children }: PropsWithChildren) {
  const contextValue = useContextHook();

  return (
    <pluginsContext.Provider value={contextValue}>
      { children }
    </pluginsContext.Provider>
  );
}

export const usePluginsContext = (): PluginsContext => {
  const context = useContext(pluginsContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
