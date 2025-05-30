import { createContext, useContext } from 'react';
import type { Context } from 'react';
import { PluginsContext } from '@/types/Plugin';

export const pluginsContext: Context<PluginsContext> = createContext<PluginsContext>({
  runWithImage: async () => { throw new Error('Plugin Context is missing'); },
  runWithImages: async () => { throw new Error('Plugin Context is missing'); },
  validateAndAddPlugin: async () => { throw new Error('Plugin Context is missing'); },
});

export const usePluginsContext = (): PluginsContext => useContext<PluginsContext>(pluginsContext);
