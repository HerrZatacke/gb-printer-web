import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import predefinedPalettes from 'gb-palettes';
import { PROJECT_PREFIX } from './constants';
// import { migrateItems } from './migrations/history/0/migrateItems';
import type { Frame } from '../../../types/Frame';
import type { Palette } from '../../../types/Palette';
import type { FrameGroup } from '../../../types/FrameGroup';
import uniqueBy from '../../tools/unique/by';
import sortBy from '../../tools/sortby';

const STORE_VERSION = 1;

const framesUniqueById = uniqueBy<Frame>('id');
const frameGroupsUniqueById = uniqueBy<FrameGroup>('id');
const sortById = sortBy<Frame>('id');
const uniqueByShortName = uniqueBy<Palette>('shortName');

// The order of calls is important: First run unique, so that new/updated items are relevant, then sort.
const sortAndUniqueById = (frames: Frame[]) => sortById(framesUniqueById(frames));

export interface Values {
  frames: Frame[],
  palettes: Palette[],
  frameGroups: FrameGroup[],
}

interface Actions {
  addFrames: (frames: Frame[]) => void,
  addPalettes: (palettes: Palette[]) => void,
  deleteFrame: (id: string) => void,
  deletePalette: (shortName: string) => void,
  updateFrameGroups: (frameGroups: FrameGroup[]) => void,
}

export type ItemsState = Values & Actions;


const useItemsStore = create<ItemsState>()(
  persist(
    (set) => ({
      frames: [],
      palettes: [],
      frameGroups: [],

      addFrames: (frames: Frame[]) => set((itemsState) => (
        { frames: sortAndUniqueById([...frames, ...itemsState.frames]) }
      )),
      addPalettes: (palettes: Palette[]) => set((itemsState) => (
        // ToDo: instead of unique, maybe update existing indices, to prevent shift
        //  in palette overwiew when editing while sorting "default desc"
        { palettes: uniqueByShortName([...palettes, ...itemsState.palettes]) }
      )),
      deleteFrame: (frameId: string) => (set(({ frames }) => (
        { frames: sortAndUniqueById(frames.filter((frame) => frameId !== frame.id)) }
      ))),
      deletePalette: (shortName: string) => set(({ palettes }) => (
        { palettes: uniqueByShortName(palettes.filter((palette) => shortName !== palette.shortName)) }
      )),
      updateFrameGroups: (frameGroups: FrameGroup[]) => (set((itemsState) => (
        { frameGroups: frameGroupsUniqueById([...frameGroups, ...itemsState.frameGroups]) }
      ))),
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
          palettes: uniqueByShortName([
            ...predefinedPalettes.map((gbPalette): Palette => ({
              ...gbPalette,
              isPredefined: true,
            })),
            ...mergedState.palettes,
          ]),
        };
      },

      partialize: (state: ItemsState): Values => ({
        frames: state.frames,
        frameGroups: state.frameGroups,
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
