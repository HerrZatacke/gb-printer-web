'use client';

import React, { createContext, useContext, PropsWithChildren } from 'react';
import { type EnvData, useContextHook } from '@/contexts/EnvContext/hook';

const envContext = createContext<EnvData | null>(null);

export const EnvProvider = ({ children }: PropsWithChildren) => {
  const contextValue = useContextHook();

  return (
    <envContext.Provider value={contextValue}>
      {children}
    </envContext.Provider>
  );
};

export const useEnv = (): EnvData => {
  const context = useContext(envContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
