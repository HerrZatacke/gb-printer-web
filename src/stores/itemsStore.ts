import predefinedPalettes from 'gb-palettes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SpecialTags } from '@/consts/SpecialTags';
import { GapiLastUpdates, SheetName } from '@/contexts/GapiSheetStateContext/consts';
import { PROJECT_PREFIX } from '@/stores/constants';
import { cleanupItems } from '@/stores/migrations/cleanupItems';
import { migrateItems } from '@/stores/migrations/history/0/migrateItems';
import { createSplitStorage, gapiLastUpdatesDefaults } from '@/stores/storage/splitStorage';
import sortBy from '@/tools/sortby';
import unique from '@/tools/unique';
import uniqueBy from '@/tools/unique/by';
import type { Frame } from '@/types/Frame';
import type { FrameGroup } from '@/types/FrameGroup';
import type { Image } from '@/types/Image';
import type { SerializableImageGroup } from '@/types/ImageGroup';
import type { Palette } from '@/types/Palette';
import type { Plugin, PluginConfigValues } from '@/types/Plugin';

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
  gapiLastLocalUpdates: GapiLastUpdates,
}

interface Actions {
  // Frame updates
  addFrames: (frames: Frame[]) => void,
  deleteFrame: (id: string) => void,

  // FrameGroup updates
  updateFrameGroups: (frameGroups: FrameGroup[]) => void,

  // Palette updates
  addPalettes: (palettes: Palette[]) => void,
  deletePalette: (shortName: string) => void,

  // Plugin updates
  addUpdatePluginProperties: (plugin: Plugin) => void,
  deletePlugin: (pluginUrl: string) => void,
  updatePluginConfig: (url: string, key: string, value: string | number) => PluginConfigValues,

  // Image updates
  addImages: (images: Image[], timestampOverride?: number) => void,
  deleteImages: (hashes: string[]) => void,
  updateImageHash: (oldHash: string, image: Image) => void,
  updateImageFavouriteTag: (isFavourite: boolean, hash: string) => void,
  updateImages: (images: Image[]) => void,
  updateFrames: (frames: Frame[]) => void,

  // ImageGroup updates
  addImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => void,
  deleteImageGroup: (groupId: string) => void,
  updateImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => void,
  groupImagesAdd: (imageGroupId: string, images: string[]) => void,
  ungroupImages: (images: string[]) => void,

  // Global Updates
  setFrames: (frames: Frame[], timestampOverride?: number) => void,
  setFrameGroups: (frameGroups: FrameGroup[], timestampOverride?: number) => void,
  setImages: (images: Image[], timestampOverride?: number) => void,
  setImageGroups: (imageGroups: SerializableImageGroup[], timestampOverride?: number) => void,
  setPalettes: (palettes: Palette[], timestampOverride?: number) => void,
  setPlugins: (plugins: Plugin[], timestampOverride?: number) => void,
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

const updateLastLocalUpdates = (get: () => ItemsState, sheetNames: SheetName[], timestampOverride?: number): Partial<ItemsState> => {
  const { gapiLastLocalUpdates } = get();
  const timestamp = typeof timestampOverride === 'number' ? timestampOverride : Date.now();

  const newGapiLastLocalUpdates = {
    ...gapiLastLocalUpdates,
  };

  sheetNames.forEach((sheetName) => {
    newGapiLastLocalUpdates[sheetName] = timestamp;
  });

  return ({
    gapiLastLocalUpdates: newGapiLastLocalUpdates,
  });
};

export const createItemsStore = () => (
  create<ItemsState>()(
    persist(
      (set, get) => ({
        frames: [],
        palettes: [],
        frameGroups: [],
        plugins: [],
        imageGroups: [],
        images: [],
        gapiLastLocalUpdates: gapiLastUpdatesDefaults(),

        addFrames: (frames: Frame[]) => set((itemsState) => (
          {
            frames: sortAndUniqueById([...frames, ...itemsState.frames]),
            ...updateLastLocalUpdates(get, [SheetName.FRAMES]),
          }
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
            ...updateLastLocalUpdates(get, [SheetName.PALETTES]),
          });
        },

        deleteFrame: (frameId: string) => (set(({ frames }) => (
          {
            frames: sortAndUniqueById(frames.filter((frame) => frameId !== frame.id)),
            ...updateLastLocalUpdates(get, [SheetName.FRAMES]),
          }
        ))),

        deletePalette: (shortName: string) => set(({ palettes }) => (
          {
            palettes: palettes.filter((palette) => shortName !== palette.shortName),
            ...updateLastLocalUpdates(get, [SheetName.PALETTES]),
          }
        )),

        deletePlugin: (pluginUrl: string) => set(({ plugins }) => (
          {
            plugins: sortByNameUniqueByUrl(plugins.filter((plugin) => pluginUrl !== plugin.url)),
            ...updateLastLocalUpdates(get, [SheetName.PLUGINS]),
          }
        )),

        updateFrameGroups: (frameGroups: FrameGroup[]) => (set((itemsState) => (
          {
            frameGroups: frameGroupsUniqueById([...frameGroups, ...itemsState.frameGroups]),
            ...updateLastLocalUpdates(get, [SheetName.FRAME_GROUPS]),
          }
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
            ...updateLastLocalUpdates(get, [SheetName.PLUGINS]),
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
            ...updateLastLocalUpdates(get, [SheetName.PLUGINS]),
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

          set({
            imageGroups: groupUniqueById([...groups, imageGroup]),
            ...updateLastLocalUpdates(get, [SheetName.IMAGE_GROUPS]),
          });
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

          set({
            imageGroups,
            ...updateLastLocalUpdates(get, [SheetName.IMAGE_GROUPS]),
          });
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

          set({
            imageGroups,
            ...updateLastLocalUpdates(get, [SheetName.IMAGE_GROUPS]),
          });
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
          ...updateLastLocalUpdates(get, [SheetName.IMAGE_GROUPS]),
        })),

        ungroupImages: (images: string[]) => set((itemsState) => ({
          imageGroups: itemsState.imageGroups.map((group): SerializableImageGroup => ({
            ...group,
            // remove images from imageGroup - images will move to root group
            images: group.images.filter((hash) => !images.includes(hash)),
          })),
          ...updateLastLocalUpdates(get, [SheetName.IMAGE_GROUPS]),
        })),

        addImages: (images: Image[], timestampOverride?: number) => set((itemsState) => ({
          images: imagesUniqueByHash([...itemsState.images, ...images]),
          ...updateLastLocalUpdates(get, [SheetName.IMAGES, SheetName.RGBN_IMAGES], timestampOverride),
        })),

        deleteImages: (hashes: string[]) => set((itemsState) => ({
          images: [...itemsState.images.filter(({ hash }) => !hashes.includes(hash))],
          ...updateLastLocalUpdates(get, [SheetName.IMAGES, SheetName.RGBN_IMAGES]),
        })),

        updateImageHash: (oldHash: string, image: Image) => set((itemsState) => ({
          images: itemsState.images.map((stateImage) => (
            (stateImage.hash === oldHash) ? image : stateImage
          )),
          ...updateLastLocalUpdates(get, [SheetName.IMAGES, SheetName.RGBN_IMAGES]),
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
          ...updateLastLocalUpdates(get, [SheetName.IMAGES, SheetName.RGBN_IMAGES]),
        })),

        updateImages: (images: Image[]) => set((itemsState) => {
          const changedImagesMap = new Map(images.map((img) => [img.hash, img]));

          return {
            images: itemsState.images.map((stateImage) => (
              changedImagesMap.get(stateImage.hash) || stateImage
            )),
            ...updateLastLocalUpdates(get, [SheetName.IMAGES, SheetName.RGBN_IMAGES]),
          };
        }),

        updateFrames: (frames: Frame[]) => set((itemsState) => {
          console.log('updateFrames', frames);
          const changedFramesMap = new Map(frames.map((frm) => [frm.hash, frm]));

          return {
            frames: itemsState.frames.map((stateFrame) => (
              changedFramesMap.get(stateFrame.hash) || stateFrame
            )),
            ...updateLastLocalUpdates(get, [SheetName.FRAMES]),
          };
        }),

        setFrames: (frames: Frame[], timestampOverride?: number) => set({
          frames: framesUniqueById(frames),
          ...updateLastLocalUpdates(get, [SheetName.FRAMES], timestampOverride),
        }),

        setFrameGroups: (frameGroups: FrameGroup[], timestampOverride?: number) => set({
          frameGroups: frameGroupsUniqueById(frameGroups),
          ...updateLastLocalUpdates(get, [SheetName.FRAME_GROUPS], timestampOverride),
        }),

        setImages: (images: Image[], timestampOverride?: number) => set({
          images: imagesUniqueByHash(images),
          ...updateLastLocalUpdates(get, [SheetName.IMAGES, SheetName.RGBN_IMAGES], timestampOverride),
        }),

        setImageGroups: (imageGroups: SerializableImageGroup[], timestampOverride?: number) => set({
          imageGroups,
          ...updateLastLocalUpdates(get, [SheetName.IMAGE_GROUPS], timestampOverride),
        }),

        setPalettes: (palettes: Palette[], timestampOverride?: number) => set({
          palettes: withPredefinedPalettes(palettes),
          ...updateLastLocalUpdates(get, [SheetName.PALETTES], timestampOverride),
        }),

        setPlugins: (plugins: Plugin[], timestampOverride?: number) => set({
          plugins: pluginsUniqueByUrl(plugins),
          ...updateLastLocalUpdates(get, [SheetName.PLUGINS], timestampOverride),
        }),
      }),
      {
        name: `${PROJECT_PREFIX}-items`,
        storage: createSplitStorage('gb-printer-web--items'),

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
          gapiLastLocalUpdates: state.gapiLastLocalUpdates,
        }),

        onRehydrateStorage: () => (hydratedState) => {
          if (hydratedState) {
            cleanupItems(hydratedState);
          }
        },

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
  )
);
