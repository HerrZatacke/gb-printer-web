import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import predefinedPalettes from 'gb-palettes';
import { PROJECT_PREFIX } from './constants';
// import { migrateItems } from './migrations/history/0/migrateItems';
import type { Frame } from '../../../types/Frame';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Palette } from '../../../types/Palette';
import type { Plugin } from '../../../types/Plugin';
import uniqueBy from '../../tools/unique/by';
import sortBy from '../../tools/sortby';

const STORE_VERSION = 1;

const framesUniqueById = uniqueBy<Frame>('id');
const frameGroupsUniqueById = uniqueBy<FrameGroup>('id');
const pluginsUniqueByUrl = uniqueBy<Plugin>('url');
const framesSortById = sortBy<Frame>('id');
const palettesUniqueByShortName = uniqueBy<Palette>('shortName');
const pluginsSortByUrl = sortBy<Plugin>('url');

// The order of calls is important: First run unique, so that new/updated items are relevant, then sort.
const sortAndUniqueById = (frames: Frame[]) => framesSortById(framesUniqueById(frames));
const sortAndUniqueByUrl = (plugins: Plugin[]) => pluginsSortByUrl(pluginsUniqueByUrl(plugins));

export interface Values {
  frames: Frame[],
  palettes: Palette[],
  frameGroups: FrameGroup[],
  plugins: Plugin[],
}

interface Actions {
  addFrames: (frames: Frame[]) => void,
  addPalettes: (palettes: Palette[]) => void,
  addPlugins: (plugins: Plugin[]) => void,
  deleteFrame: (id: string) => void,
  deletePalette: (shortName: string) => void,
  deletePlugin: (pluginUrl: string) => void,
  updateFrameGroups: (frameGroups: FrameGroup[]) => void,
  updatePluginProperties: (plugin: Plugin) => void,
  updatePluginConfig: (plugin: Plugin) => void,
}

export type ItemsState = Values & Actions;


const useItemsStore = create<ItemsState>()(
  persist(
    (set) => ({
      frames: [],
      palettes: [],
      frameGroups: [],
      plugins: [],

      addFrames: (frames: Frame[]) => set((itemsState) => (
        { frames: sortAndUniqueById([...frames, ...itemsState.frames]) }
      )),

      addPalettes: (palettes: Palette[]) => set((itemsState) => (
        // ToDo: instead of unique, maybe update existing indices, to prevent shift
        //  in palette overwiew when editing while sorting "default desc"
        { palettes: palettesUniqueByShortName([...palettes, ...itemsState.palettes]) }
      )),

      addPlugins: (plugins: Plugin[]) => set((itemsState) => (
        { plugins: pluginsUniqueByUrl([...plugins, ...itemsState.plugins]) }
      )),

      deleteFrame: (frameId: string) => (set(({ frames }) => (
        { frames: sortAndUniqueById(frames.filter((frame) => frameId !== frame.id)) }
      ))),

      deletePalette: (shortName: string) => set(({ palettes }) => (
        { palettes: palettesUniqueByShortName(palettes.filter((palette) => shortName !== palette.shortName)) }
      )),

      // ToDo: remove instance from global plugin list (interface RegisteredPlugins)
      deletePlugin: (pluginUrl: string) => set(({ plugins }) => (
        { plugins: pluginsUniqueByUrl(plugins.filter((plugin) => pluginUrl !== plugin.url)) }
      )),

      updateFrameGroups: (frameGroups: FrameGroup[]) => (set((itemsState) => (
        { frameGroups: frameGroupsUniqueById([...frameGroups, ...itemsState.frameGroups]) }
      ))),

      updatePluginConfig: (plugin: Plugin) => set((itemsState) => ({
        plugins: sortAndUniqueByUrl(pluginsUniqueByUrl(itemsState.plugins.map((mapPlugin) => {
          if (mapPlugin.url !== plugin.url) {
            return mapPlugin;
          }

          return {
            ...mapPlugin,
            config: {
              ...(mapPlugin.config || {}),
              ...(plugin.config || {}),
            },
          };
        }))),
      })),

      updatePluginProperties: (plugin: Plugin) => set((itemsState) => ({
        plugins: sortAndUniqueByUrl(pluginsUniqueByUrl(itemsState.plugins.map((mapPlugin) => {
          if (mapPlugin.url !== plugin.url) {
            return mapPlugin;
          }

          return {
            ...mapPlugin,
            ...plugin,
          };
        }))),
      })),
    }),
    {
      name: `${PROJECT_PREFIX}-items`,
      storage: createJSONStorage(() => localStorage),

      merge: (persistedState: unknown, currentState: ItemsState): ItemsState => {
        const mergedState: ItemsState = {
          ...currentState,
          ...(persistedState as object),
        };

        return {
          ...mergedState,
          palettes: palettesUniqueByShortName([
            ...predefinedPalettes.map((gbPalette): Palette => ({
              ...gbPalette,
              isPredefined: true,
            })),
            ...mergedState.palettes,
          ]),
          plugins: mergedState.plugins.map((plugin) => ({
            ...plugin,
            loading: true,
          })),
        };
      },

      partialize: (state: ItemsState): Values => ({
        frames: state.frames,
        frameGroups: state.frameGroups,
        plugins: state.plugins.map((plugin) => ({
          ...plugin,
          loading: undefined,
          error: undefined,
        })),
        palettes: state.palettes.filter(({ isPredefined }) => !isPredefined),
      }),

      version: STORE_VERSION,
      // migrate: async (persistedState: unknown, version: number): Promise<Partial<ItemsState>> => {
      migrate: (persistedState: unknown, version: number): Values => {
        let finalState;

        if (version === -1) {
          finalState = persistedState;
        }

        // if (version === 0) {
        //   finalState = await migrateItems(persistedState);
        // }

        return finalState as Values;
      },
    },
  ),
);

export default useItemsStore;
