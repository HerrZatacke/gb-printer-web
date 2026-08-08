'use client';

import dynamic from 'next/dynamic';
import {
  type PropsWithChildren,
  createContext,
  useContext,
} from 'react';
import {
  type UseSearchParams,
  useContextHook,
} from '@/contexts/SearchParamsContext/hook';

const SearchParamsUpdateTrigger = dynamic(() => import('@/contexts/SearchParamsContext/SearchParamsUpdateTrigger'), {
  ssr: false,
  loading: () => null,
});


const searchParamsContext = createContext<UseSearchParams | null>(null);

export function SearchParamsProvider({ children }: PropsWithChildren) {
  const contextValue = useContextHook();
  return (
    <searchParamsContext.Provider value={contextValue}>
      {children}

      <SearchParamsUpdateTrigger setClientSearchParams={contextValue.setClientSearchParams} />
    </searchParamsContext.Provider>
  );
}

export const useClientSearchParams = (): UseSearchParams => {
  const context = useContext(searchParamsContext);

  if (!context) {
    throw new Error('Missing ContextProvider');
  }

  return context;
};
