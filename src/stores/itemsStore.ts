import predefinedPalettes from 'gb-palettes';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// import { migrateItems } from './migrations/history/0/migrateItems';
import { SpecialTags } from '@/consts/SpecialTags';
import sortBy from '@/tools/sortby';
import unique from '@/tools/unique';
import uniqueBy from '@/tools/unique/by';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { Image } from '@/types/Image';
import type { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin, PluginConfigValues } from '@/types/Plugin';
import { PROJECT_PREFIX } from './constants';
import { migrateItems } from './migrations/history/0/migrateItems';

export const ITEMS_STORE_VERSION = 1;

const framesUniqueById = uniqueBy<Frame>('id');
const frameGroupsUniqueById = uniqueBy<FrameGroup>('id');
const groupUniqueById = uniqueBy<SerializableImageGroup>('id');
const pluginsUniqueByUrl = uniqueBy<Plugin>('url');
const framesSortById = sortBy<Frame>('id');
const palettesUniqueByShortName = uniqueBy<Palette>('shortName');
const pluginsSortByName = sortBy<Plugin>('name');
const imagesUniqueByHash = uniqueBy<Image>('hash');

// The order of calls is important: First run unique, so that new/updated items are relevant, then sort.
const sortAndUniqueById = (frames: Frame[]) => framesSortById(framesUniqueById(frames));
const sortByNameUniqueByUrl = (plugins: Plugin[]) => pluginsSortByName(pluginsUniqueByUrl(plugins));

export interface Values {
  frames: Frame[],
  palettes: Palette[],
  frameGroups: FrameGroup[],
  plugins: Plugin[],
  imageGroups: SerializableImageGroup[],
  images: Image[],
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
  groupImagesAdd: (imageGroupId: string, images: string[]) => void,
  ungroupImages: (images: string[]) => void,
  setImageGroups: (imageGroups: SerializableImageGroup[]) => void,

  addImages: (images: Image[]) => void,
  deleteImages: (hashes: string[]) => void,
  updateImageHash: (oldHash: string, image: Image) => void,
  updateImageFavouriteTag: (isFavourite: boolean, hash: string) => void,
  updateImages: (images: Image[]) => void,

  setFrames: (frames: Frame[]) => void,
  setImages: (images: Image[]) => void,
  setPalettes: (palettes: Palette[]) => void,
}

export type ItemsState = Values & Actions;

interface AddUpdatePalettes {
  add: Palette[],
  update: Palette[],
}

const withPredefinedPalettes = (palettes: Palette[]): Palette[] => palettesUniqueByShortName([
  ...predefinedPalettes.map((gbPalette): Palette => ({
    ...gbPalette,
    isPredefined: true,
  })),
  ...palettes,
]);

const useItemsStore = create<ItemsState>()(
  persist(
    (set, get) => ({
      frames: [],
      palettes: [],
      frameGroups: [],
      plugins: [],
      imageGroups: [],
      images: [],

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

        const groups = imageGroups.map((group: SerializableImageGroup) => {
          // remove images in current selection from _all other_ imagegroups.
          const images = group.images.filter((hash: string) => !imageGroup.images.includes(hash));

          // add new group id to parent group.
          const groupGroups = group.id === parentId ? [...group.groups, imageGroup.id] : group.groups;

          return { ...group, groups: groupGroups, images };
        });

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

      groupImagesAdd: (imageGroupId: string, images: string[]) => set((itemsState) => ({
        imageGroups: itemsState.imageGroups.map((group): SerializableImageGroup => (
          group.id === imageGroupId ? {
            ...group,
            // new images for matching imageGroupId
            images: [
              ...group.images,
              ...images,
            ],
          } : {
            ...group,
            // remove all images from non-matching imageGroupId
            images: group.images.filter((hash) => !images.includes(hash)),
          }
        )),
      })),

      ungroupImages: (images: string[]) => set((itemsState) => ({
        imageGroups: itemsState.imageGroups.map((group): SerializableImageGroup => ({
          ...group,
          // remove images from imageGroup - images will move to root group
          images: group.images.filter((hash) => !images.includes(hash)),
        })),
      })),

      setImageGroups: (imageGroups: SerializableImageGroup[]) => set({ imageGroups }),

      addImages: (images: Image[]) => set((itemsState) => ({
        images: imagesUniqueByHash([...itemsState.images, ...images]),
      })),

      deleteImages: (hashes: string[]) => set((itemsState) => ({
        images: [...itemsState.images.filter(({ hash }) => !hashes.includes(hash))],
      })),

      updateImageHash: (oldHash: string, image: Image) => set((itemsState) => ({
        images: itemsState.images.map((stateImage) => (
          (stateImage.hash === oldHash) ? image : stateImage
        )),
      })),

      updateImageFavouriteTag: (isFavourite: boolean, hash: string) => set((itemsState) => ({
        images: itemsState.images.map((image) => (
          (image.hash === hash) ? {
            ...image,
            tags: unique(
              isFavourite ?
                [SpecialTags.FILTER_FAVOURITE, ...image.tags] :
                image.tags.filter((tag) => tag !== SpecialTags.FILTER_FAVOURITE),
            ),
          } : image
        )),
      })),

      updateImages: (images: Image[]) => set((itemsState) => {
        const changedImagesMap = new Map(images.map((img) => [img.hash, img]));

        return {
          images: itemsState.images.map((stateImage) => (
            changedImagesMap.get(stateImage.hash) || stateImage
          )),
        };
      }),

      setFrames: (frames: Frame[]) => set({ frames: framesUniqueById(frames) }),
      setImages: (images: Image[]) => set({ images: imagesUniqueByHash(images) }),
      setPalettes: (palettes: Palette[]) => set({ palettes: withPredefinedPalettes(palettes) }),
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
          palettes: withPredefinedPalettes(mergedState.palettes),
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
        images: state.images,
        plugins: state.plugins.map((plugin) => ({
          ...plugin,
          loading: undefined,
          error: undefined,
        })),
        palettes: state.palettes.filter(({ isPredefined }) => !isPredefined),
      }),

      version: ITEMS_STORE_VERSION,
      // migrate: async (persistedState: unknown, version: number): Promise<Partial<ItemsState>> => {
      migrate: async (persistedState: unknown, version: number): Promise<Values> => {
        let finalState;

        // console.log({ version });
        if (version === 0) {
          finalState = await migrateItems(persistedState);
        }

        return finalState as Values;
      },
    },
  ),
);

export default useItemsStore;
