import { createContext, useContext } from 'react';
import type { Context } from 'react';
import type { Plugin } from '../../../../types/Plugin';

export interface PluginsContext {
  runWithImage: (pluginUrl: string, imageHash: string) => Promise<void>,
  runWithImages: (pluginUrl: string, imageSelection: string[]) => Promise<void>,
  validateAndAddPlugin: (plugin: Plugin) => Promise<boolean>,
}

export const pluginsContext: Context<PluginsContext> = createContext<PluginsContext>({
  runWithImage: async () => { /**/ },
  runWithImages: async () => { /**/ },
  validateAndAddPlugin: async () => false,
});

export const usePluginsContext = (): PluginsContext => useContext<PluginsContext>(pluginsContext);
