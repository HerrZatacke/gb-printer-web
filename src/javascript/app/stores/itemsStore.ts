import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import predefinedPalettes from 'gb-palettes';
import { PROJECT_PREFIX } from './constants';
// import { migrateItems } from './migrations/history/0/migrateItems';
import type { Frame } from '../../../types/Frame';
import type { Palette } from '../../../types/Palette';
import uniqueBy from '../../tools/unique/by';

const STORE_VERSION = 1;

const uniqueById = uniqueBy<Frame>('id');
const uniqueByShortName = uniqueBy<Palette>('shortName');

export interface Values {
  frames: Frame[],
  palettes: Palette[],
}

interface Actions {
  addFrames: (frames: Frame[]) => void,
  addPalettes: (palettes: Palette[]) => void,
  deleteFrame: (id: string) => void,
  deletePalette: (shortName: string) => void,
}

export type ItemsState = Values & Actions;


const useItemsStore = create<ItemsState>()(
  persist(
    (set) => ({
      frames: [],
      palettes: [],

      addFrames: (frames: Frame[]) => set((itemsState) => (
        // ToDo: instead of unique, maybe update existing indices (same as with palettes)
        { frames: uniqueById([...frames, ...itemsState.frames]) }
      )),
      addPalettes: (palettes: Palette[]) => set((itemsState) => (
        // ToDo: instead of unique, maybe update existing indices, to prevent shift
        //  in palette overwiew when editing while sorting "default desc"
        { palettes: uniqueByShortName([...palettes, ...itemsState.palettes]) }
      )),
      deleteFrame: (frameId: string) => (set(({ frames }) => (
        { frames: frames.filter((frame) => frameId !== frame.id) }
      ))),
      deletePalette: (shortName: string) => set(({ palettes }) => (
        { palettes: palettes.filter((palette) => shortName !== palette.shortName) }
      )),
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
