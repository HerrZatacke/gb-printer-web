import predefinedPalettes from 'gb-palettes';
import z from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import { SpecialTags } from '@/consts/SpecialTags';
import { PROJECT_PREFIX } from '@/stores/constants';
// import { cleanupItems } from '@/stores/migrations/cleanupItems';
import { migrateItems } from '@/stores/migrations/history/0/migrateItems';
import { createSplitStorage } from '@/stores/storage/splitStorage';
// import unique from '@/tools/unique';
import uniqueBy from '@/tools/unique/by';
import { FrameSchema } from '@/types/Frame';
import { FrameGroupSchema } from '@/types/FrameGroup';
import { ImageSchema } from '@/types/Image';
import { SerializableImageGroupSchema } from '@/types/ImageGroup';
import { type Palette, PaletteSchema } from '@/types/Palette';
import { PluginSchema } from '@/types/Plugin';

export const ITEMS_STORE_VERSION = 1;

// const framesUniqueById = uniqueBy<Frame>('id');
// const frameGroupsUniqueById = uniqueBy<FrameGroup>('id');
// const groupUniqueById = uniqueBy<SerializableImageGroup>('id');
// const pluginsUniqueByUrl = uniqueBy<Plugin>('url');
// const framesSortById = sortBy<Frame>('id');
const palettesUniqueByShortName = uniqueBy<Palette>('shortName');
// const pluginsSortByName = sortBy<Plugin>('name');
// const imagesUniqueByHash = uniqueBy<Image>('hash');

// The order of calls is important: First run unique, so that new/updated items are relevant, then sort.
// const sortAndUniqueById = (frames: Frame[]) => framesSortById(framesUniqueById(frames));
// const sortByNameUniqueByUrl = (plugins: Plugin[]) => pluginsSortByName(pluginsUniqueByUrl(plugins));

const ValuesSchema = z.object({
  initialized: z.boolean(),
  /** @deprecated Use `useFrames` instead */
  frames: z.array(FrameSchema),
  /** @deprecated Use `useFrameGroups` instead */
  frameGroups: z.array(FrameGroupSchema),
  /** @deprecated Use `usePalettes` instead */
  palettes: z.array(PaletteSchema),
  /** @deprecated Use `usePlugins` instead */
  plugins: z.array(PluginSchema),
  /** @deprecated Use `usePlugins` instead */
  images: z.array(ImageSchema),
  /** @deprecated Use `usePlugins` instead */
  imageGroups: z.array(SerializableImageGroupSchema),
});

export type Values = z.infer<typeof ValuesSchema>;

// interface Actions {
  // Frame updates
  // addFrames: (frames: Frame[]) => void;
  // deleteFrame: (id: string) => void;

  // FrameGroup updates
  // updateFrameGroups: (frameGroups: FrameGroup[]) => void;

  // Palette updates
  // addPalettes: (palettes: Palette[]) => void;
  // deletePalette: (shortName: string) => void;

  // Plugin updates
  // addUpdatePluginProperties: (plugin: Plugin) => void;
  // deletePlugin: (pluginUrl: string) => void;
  // updatePluginConfig: (url: string, key: string, value: string | number) => PluginConfigValues;

  // Image updates
  // addImages: (images: Image[]) => void;
  // // deleteImages: (hashes: string[]) => void;
  // // updateImageFavouriteTag: (isFavourite: boolean, hash: string) => void;
  // updateImages: (images: Image[]) => void;
  // updateFrames: (frames: Frame[]) => void;

  // ImageGroup updates
  // addImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => void;
  // deleteImageGroup: (groupId: string) => void;
  // updateImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => void;
  // groupImagesAdd: (imageGroupId: string, images: string[]) => void;
  // ungroupImages: (images: string[]) => void;

  // Global Updates
  // setFrames: (frames: Frame[]) => void;
  // setFrameGroups: (frameGroups: FrameGroup[]) => void;
  // setImages: (images: Image[]) => void;
  // setImageGroups: (imageGroups: SerializableImageGroup[]) => void;
  // setPalettes: (palettes: Palette[]) => void;
  // setPlugins: (plugins: Plugin[]) => void;
// }

export type ItemsState = Values; // & Actions;

// interface AddUpdatePalettes {
//   add: Palette[];
//   update: Palette[];
// }

const withPredefinedPalettes = (palettes: Palette[]): Palette[] => palettesUniqueByShortName([
  ...predefinedPalettes.map((gbPalette): Palette => ({
    ...gbPalette,
    isPredefined: true,
  })),
  ...palettes,
]);

export const createItemsStore = (onError: (err: Error) => void) => (
  create<ItemsState>()(
    persist(
      (/*set, get*/) => ({
        initialized: false,
        frames: [],
        palettes: [],
        frameGroups: [],
        plugins: [],
        imageGroups: [],
        images: [],

        // addFrames: (frames: Frame[]) => set((itemsState) => (
        //   {
        //     frames: sortAndUniqueById([...frames, ...itemsState.frames]),
        //   }
        // )),

        // addPalettes: (palettes: Palette[]) => {
        //   const { palettes: statePalettes } = get();
        //
        //   // split palettes to be added
        //   const { update, add } = palettes.reduce((acc: AddUpdatePalettes, palette): AddUpdatePalettes => {
        //     const paletteIsKnown = !!statePalettes.find((statePalette) => statePalette.shortName === palette.shortName);
        //
        //     return paletteIsKnown ? {
        //       update: [...acc.update, palette],
        //       add: acc.add,
        //     } : {
        //       update: acc.update,
        //       add: [...acc.add, palette],
        //     };
        //   }, { add: [], update: [] });
        //
        //   set({
        //     palettes: palettesUniqueByShortName([
        //       ...add,
        //       ...statePalettes.map((statePalette) => (
        //         update.find(({ shortName }) => shortName === statePalette.shortName) || statePalette
        //       )),
        //     ]),
        //   });
        // },

        // deleteFrame: (frameId: string) => (set(({ frames }) => (
        //   {
        //     frames: sortAndUniqueById(frames.filter((frame) => frameId !== frame.id)),
        //   }
        // ))),

        // deletePalette: (shortName: string) => set(({ palettes }) => (
        //   {
        //     palettes: palettes.filter((palette) => shortName !== palette.shortName),
        //   }
        // )),

        // deletePlugin: (pluginUrl: string) => set(({ plugins }) => (
        //   {
        //     plugins: sortByNameUniqueByUrl(plugins.filter((plugin) => pluginUrl !== plugin.url)),
        //   }
        // )),

        // updateFrameGroups: (frameGroups: FrameGroup[]) => (set((itemsState) => (
        //   {
        //     frameGroups: frameGroupsUniqueById([...frameGroups, ...itemsState.frameGroups]),
        //   }
        // ))),

        // updatePluginConfig: (url: string, key: string, value: string | number): PluginConfigValues => {
        //   const { plugins } = get();
        //
        //   const findPlugin = plugins.find((plugin) => plugin.url === url);
        //
        //   if (!findPlugin) {
        //     throw new Error(`Plugin "${url}" not found`);
        //   }
        //
        //   let changedPlugin: Plugin = findPlugin;
        //
        //   const newConfigValues: PluginConfigValues = {
        //     ...(changedPlugin.config || {}),
        //     [key]: value,
        //   };
        //
        //   changedPlugin = {
        //     ...changedPlugin,
        //     config: newConfigValues,
        //   };
        //
        //   set({
        //     plugins: plugins.map((mapPlugin): Plugin => (
        //       mapPlugin.url !== url ? mapPlugin : changedPlugin
        //     )),
        //   });
        //
        //   return newConfigValues;
        // },

        // addUpdatePluginProperties: (plugin: Plugin) => {
        //   const { plugins } = get();
        //   const updatedPlugins: Plugin[] = [...plugins];
        //
        //   const findPlugin = plugins.find(({ url }) => plugin.url === url);
        //
        //   if (!findPlugin) {
        //     updatedPlugins.push(plugin);
        //   }
        //
        //   set({
        //     plugins: sortByNameUniqueByUrl(updatedPlugins.map((mapPlugin) => (
        //       (mapPlugin.url !== plugin.url) ? mapPlugin : { ...mapPlugin, ...plugin }
        //     ))),
        //   });
        // },

        // addImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => {
        //   const { imageGroups: stateImageGroups } = get();
        //
        //   const imageGroups = stateImageGroups.map((group: SerializableImageGroup) => {
        //     // remove images in current selection from _all other_ imagegroups.
        //     const images = group.images.filter((hash: string) => !imageGroup.images.includes(hash));
        //
        //     // add new group id to parent group.
        //     const groupGroups = group.id === parentId ? [...group.groups, imageGroup.id] : group.groups;
        //
        //     return { ...group, groups: groupGroups, images };
        //   });
        //
        //   set({
        //     imageGroups: groupUniqueById([...imageGroups, imageGroup]),
        //   });
        // },

        // deleteImageGroup: (groupId: string) => {
        //   const { imageGroups: stateImageGroups } = get();
        //
        //   const deleteGroup = stateImageGroups.find(({ id }) => id === groupId);
        //
        //   if (!deleteGroup) {
        //     return;
        //   }
        //
        //   const imageGroups = stateImageGroups.reduce((
        //     acc: SerializableImageGroup[],
        //     reduceGroup: SerializableImageGroup,
        //   ): SerializableImageGroup[] => {
        //     if (reduceGroup.id === groupId) {
        //       return acc;
        //     }
        //
        //     if (reduceGroup.groups.includes(groupId)) { // group to be deleted is child of reduceGroup
        //       return [
        //         ...acc,
        //         {
        //           ...reduceGroup,
        //           images: [...reduceGroup.images, ...deleteGroup.images],
        //           groups: [...reduceGroup.groups, ...deleteGroup.groups].filter((id) => id !== deleteGroup.id),
        //         },
        //       ];
        //     }
        //
        //     return [...acc, reduceGroup];
        //   }, []);
        //
        //   set({
        //     imageGroups,
        //   });
        // },

        // updateImageGroup: (imageGroup: SerializableImageGroup, parentId: string) => {
        //   const { imageGroups: stateImageGroups } = get();
        //
        //   const imageGroups = stateImageGroups.map((group) => {
        //     const updateGroup = { ...group };
        //
        //     updateGroup.groups = updateGroup.groups.filter((childGroupId) => childGroupId !== imageGroup.id);
        //
        //     if (parentId === updateGroup.id) {
        //       updateGroup.groups = [...updateGroup.groups, imageGroup.id];
        //     }
        //
        //     return updateGroup.id === imageGroup.id ? imageGroup : updateGroup;
        //   });
        //
        //   set({
        //     imageGroups,
        //   });
        // },

        // groupImagesAdd: (imageGroupId: string, images: string[]) => set((itemsState) => ({
        //   imageGroups: itemsState.imageGroups.map((group): SerializableImageGroup => (
        //     group.id === imageGroupId ? {
        //       ...group,
        //       // new images for matching imageGroupId
        //       images: [
        //         ...group.images,
        //         ...images,
        //       ],
        //     } : {
        //       ...group,
        //       // remove all images from non-matching imageGroupId
        //       images: group.images.filter((hash) => !images.includes(hash)),
        //     }
        //   )),
        // })),

        // ungroupImages: (images: string[]) => set((itemsState) => ({
        //   imageGroups: itemsState.imageGroups.map((group): SerializableImageGroup => ({
        //     ...group,
        //     // remove images from imageGroup - images will move to root group
        //     images: group.images.filter((hash) => !images.includes(hash)),
        //   })),
        // })),

        // addImages: (images: Image[]) => set((itemsState) => ({
        //   images: imagesUniqueByHash([...itemsState.images, ...images]),
        // })),

        // deleteImages: (hashes: string[]) => set((itemsState) => ({
        //   images: [...itemsState.images.filter(({ hash }) => !hashes.includes(hash))],
        // })),

        // updateImageFavouriteTag: (isFavourite: boolean, hash: string) => set((itemsState) => ({
        //   images: itemsState.images.map((image) => (
        //     (image.hash === hash) ? {
        //       ...image,
        //       tags: unique(
        //         isFavourite ?
        //           [SpecialTags.FILTER_FAVOURITE, ...image.tags] :
        //           image.tags.filter((tag) => tag !== SpecialTags.FILTER_FAVOURITE),
        //       ),
        //     } : image
        //   )),
        // })),

        // updateImages: (images: Image[]) => set((itemsState) => {
        //   const changedImagesMap = new Map(images.map((img) => [img.hash, img]));
        //
        //   return {
        //     images: itemsState.images.map((stateImage) => (
        //       changedImagesMap.get(stateImage.hash) || stateImage
        //     )),
        //   };
        // }),

        // updateFrames: (frames: Frame[]) => set((itemsState) => {
        //   console.log('updateFrames', frames);
        //   const changedFramesMap = new Map(frames.map((frm) => [frm.hash, frm]));
        //
        //   return {
        //     frames: itemsState.frames.map((stateFrame) => (
        //       changedFramesMap.get(stateFrame.hash) || stateFrame
        //     )),
        //   };
        // }),

        // setFrames: (frames: Frame[]) => set({
        //   frames: framesUniqueById(frames),
        // }),

        // setFrameGroups: (frameGroups: FrameGroup[]) => set({
        //   frameGroups: frameGroupsUniqueById(frameGroups),
        // }),

        // setImages: (images: Image[]) => set({
        //   images: imagesUniqueByHash(images),
        // }),

        // setImageGroups: (imageGroups: SerializableImageGroup[]) => set({
        //   imageGroups,
        // }),

        // setPalettes: (palettes: Palette[]) => set({
        //   palettes: withPredefinedPalettes(palettes),
        // }),
        //
        // setPlugins: (plugins: Plugin[]) => set({
        //   plugins: pluginsUniqueByUrl(plugins),
        // }),
      }),
      {
        name: `${PROJECT_PREFIX}-items`,
        storage: createSplitStorage('gb-printer-web--items'),

        merge: (persistedState: unknown, currentState: ItemsState): ItemsState => {
          const mergedState: ItemsState = {
            ...(currentState as ItemsState),
            ...(persistedState as object),
            initialized: true,
          };

          const itemsState: ItemsState = {
            ...mergedState,
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            palettes: withPredefinedPalettes(mergedState.palettes),
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            plugins: mergedState.plugins.map((plugin) => ({
              ...plugin,
              loading: false,
            })),
          };

          // console.log(itemsState.images[1291]);

          try {
            const values = ValuesSchema.parse(itemsState);

            return {
              ...currentState,
              ...values,
            };
          } catch (error) {
            onError(error as Error);
            return itemsState;
          }
        },

        partialize: (state: ItemsState): Values => ({
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          frames: state.frames,
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          frameGroups: state.frameGroups,
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          imageGroups: state.imageGroups,
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          images: state.images,
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          plugins: state.plugins.map((plugin) => ({
            ...plugin,
            loading: undefined,
            error: undefined,
          })),
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          palettes: state.palettes.filter(({ isPredefined }) => !isPredefined),
          initialized: false,
        }),

        // onRehydrateStorage: () => (hydratedState) => {
        //   if (hydratedState) {
        //     cleanupItems(hydratedState);
        //   }
        // },

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
