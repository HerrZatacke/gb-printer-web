import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import predefinedPalettes from 'gb-palettes';
import { PROJECT_PREFIX } from './constants';
// import { migrateItems } from './migrations/history/0/migrateItems';
import type { Frame } from '../../../types/Frame';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Palette } from '../../../types/Palette';
import type { Plugin, PluginConfigValues } from '../../../types/Plugin';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import uniqueBy from '../../tools/unique/by';
import sortBy from '../../tools/sortby';

const STORE_VERSION = 1;

const framesUniqueById = uniqueBy<Frame>('id');
const frameGroupsUniqueById = uniqueBy<FrameGroup>('id');
const groupUniqueById = uniqueBy<SerializableImageGroup>('id');
const pluginsUniqueByUrl = uniqueBy<Plugin>('url');
const framesSortById = sortBy<Frame>('id');
const palettesUniqueByShortName = uniqueBy<Palette>('shortName');
const pluginsSortByName = sortBy<Plugin>('name');

// The order of calls is important: First run unique, so that new/updated items are relevant, then sort.
const sortAndUniqueById = (frames: Frame[]) => framesSortById(framesUniqueById(frames));
const sortByNameUniqueByUrl = (plugins: Plugin[]) => pluginsSortByName(pluginsUniqueByUrl(plugins));

export interface Values {
  frames: Frame[],
  palettes: Palette[],
  frameGroups: FrameGroup[],
  plugins: Plugin[],
  imageGroups: SerializableImageGroup[],
}

interface Actions {
  addFrames: (frames: Frame[]) => void,
  addPalettes: (palettes: Palette[]) => void,
  deleteFrame: (id: string) => void,
  deletePalette: (shortName: string) => void,
  deletePlugin: (pluginUrl: string) => void,
  updateFrameGroups: (frameGroups: FrameGroup[]) => void,
  addUpdatePluginProperties: (plugin: Plugin) => void,
  updatePluginConfig: (url: string, key: string, value: string | number) => PluginConfigValues,
  addImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => void,
  deleteImageGroup: (groupId: string) => void,
  updateImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => void,
  setImageGroups: (imageGroups: SerializableImageGroup[]) => void,
}

export type ItemsState = Values & Actions;

interface AddUpdatePalettes {
  add: Palette[],
  update: Palette[],
}

const useItemsStore = create<ItemsState>()(
  persist(
    (set, get) => ({
      frames: [],
      palettes: [],
      frameGroups: [],
      plugins: [],
      imageGroups: [],

      addFrames: (frames: Frame[]) => set((itemsState) => (
        { frames: sortAndUniqueById([...frames, ...itemsState.frames]) }
      )),

      addPalettes: (palettes: Palette[]) => {
        const { palettes: statePalettes } = get();

        // split palettes to be added
        const { update, add } = palettes.reduce((acc: AddUpdatePalettes, palette): AddUpdatePalettes => {
          const paletteIsKnown = !!statePalettes.find((statePalette) => statePalette.shortName === palette.shortName);

          return paletteIsKnown ? {
            update: [...acc.update, palette],
            add: acc.add,
          } : {
            update: acc.update,
            add: [...acc.add, palette],
          };
        }, { add: [], update: [] });

        set({
          palettes: palettesUniqueByShortName([
            ...add,
            ...statePalettes.map((statePalette) => (
              update.find(({ shortName }) => shortName === statePalette.shortName) || statePalette
            )),
          ]),
        });
      },

      deleteFrame: (frameId: string) => (set(({ frames }) => (
        { frames: sortAndUniqueById(frames.filter((frame) => frameId !== frame.id)) }
      ))),

      deletePalette: (shortName: string) => set(({ palettes }) => (
        { palettes: palettes.filter((palette) => shortName !== palette.shortName) }
      )),

      deletePlugin: (pluginUrl: string) => set(({ plugins }) => (
        { plugins: sortByNameUniqueByUrl(plugins.filter((plugin) => pluginUrl !== plugin.url)) }
      )),

      updateFrameGroups: (frameGroups: FrameGroup[]) => (set((itemsState) => (
        { frameGroups: frameGroupsUniqueById([...frameGroups, ...itemsState.frameGroups]) }
      ))),

      updatePluginConfig: (url: string, key: string, value: string | number): PluginConfigValues => {
        const { plugins } = get();

        const findPlugin = plugins.find((plugin) => plugin.url === url);

        if (!findPlugin) {
          throw new Error(`Plugin "${url}" not found`);
        }

        let changedPlugin: Plugin = findPlugin;

        const newConfigValues: PluginConfigValues = {
          ...(changedPlugin.config || {}),
          [key]: value,
        };

        changedPlugin = {
          ...changedPlugin,
          config: newConfigValues,
        };

        set({
          plugins: plugins.map((mapPlugin): Plugin => (
            mapPlugin.url !== url ? mapPlugin : changedPlugin
          )),
        });

        return newConfigValues;
      },

      addUpdatePluginProperties: (plugin: Plugin) => {
        const { plugins } = get();
        const updatedPlugins: Plugin[] = [...plugins];

        const findPlugin = plugins.find(({ url }) => plugin.url === url);

        if (!findPlugin) {
          updatedPlugins.push(plugin);
        }

        set({
          plugins: sortByNameUniqueByUrl(updatedPlugins.map((mapPlugin) => (
            (mapPlugin.url !== plugin.url) ? mapPlugin : { ...mapPlugin, ...plugin }
          ))),
        });
      },

      addImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => {
        const { imageGroups } = get();

        const groups = imageGroups.map((group: SerializableImageGroup) => (
          group.id !== parentId ? group : {
            ...group,
            groups: [...group.groups, imageGroup.id],
            images: group.images.filter((hash: string) => !imageGroup.images.includes(hash)),
          }
        ));

        set({ imageGroups: groupUniqueById([...groups, imageGroup]) });
      },

      deleteImageGroup: (groupId: string) => {
        const { imageGroups: stateImageGroups } = get();

        const deleteGroup = stateImageGroups.find(({ id }) => id === groupId);

        if (!deleteGroup) {
          return;
        }

        const imageGroups = stateImageGroups.reduce((
          acc: SerializableImageGroup[],
          reduceGroup: SerializableImageGroup,
        ): SerializableImageGroup[] => {
          if (reduceGroup.id === groupId) {
            return acc;
          }

          if (reduceGroup.groups.includes(groupId)) { // group to be deleted is child of reduceGroup
            return [
              ...acc,
              {
                ...reduceGroup,
                images: [...reduceGroup.images, ...deleteGroup.images],
                groups: [...reduceGroup.groups, ...deleteGroup.groups].filter((id) => id !== deleteGroup.id),
              },
            ];
          }

          return [...acc, reduceGroup];
        }, []);

        set({ imageGroups });
      },

      updateImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => {
        const { imageGroups: stateImageGroups } = get();

        const imageGroups = stateImageGroups.map((group) => {
          const updateGroup = { ...group };

          updateGroup.groups = updateGroup.groups.filter((childGroupId) => childGroupId !== imageGroup.id);

          if (parentId === updateGroup.id) {
            updateGroup.groups = [...updateGroup.groups, imageGroup.id];
          }

          return updateGroup.id === imageGroup.id ? imageGroup : updateGroup;
        });

        set({ imageGroups });
      },

      setImageGroups: (imageGroups: SerializableImageGroup[]) => set({ imageGroups }),
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
            loading: false,
          })),
        };
      },

      partialize: (state: ItemsState): Values => ({
        frames: state.frames,
        frameGroups: state.frameGroups,
        imageGroups: state.imageGroups,
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
