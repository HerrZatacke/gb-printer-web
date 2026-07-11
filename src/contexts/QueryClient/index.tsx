'use client';
import { QueryClient, environmentManager, QueryClientProvider as LibQueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

let queryClientInstance: QueryClient | undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    // ssr client is never actually used
    return new QueryClient();
  }

  if (!queryClientInstance) {
    queryClientInstance = new QueryClient();
  }

  return queryClientInstance;
}


export function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <LibQueryClientProvider client={getQueryClient()}>
      {children}
    </LibQueryClientProvider>
  );
}
