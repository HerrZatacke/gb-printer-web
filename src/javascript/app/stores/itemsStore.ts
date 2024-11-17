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
  updateFrames: (frames: Frame[]) => void,
}

export type ItemsState = Values & Actions;


const useItemsStore = create<ItemsState>()(
  persist(
    (set) => ({
      frames: [{
        hash: 'bc0737a23b540ff1e12ccac8c8f537045becffd9',
        id: 'test01',
        name: 'test',
      }],
      palettes: [],

      updateFrames: (frames: Frame[]) => set((itemsState) => (
        { frames: uniqueById([...frames, ...itemsState.frames]) }
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

      partialize: (state: ItemsState): Partial<ItemsState> => ({
        frames: state.frames,
        palettes: state.palettes.filter(({ isPredefined }) => !isPredefined),
      }),

      version: STORE_VERSION,
      // migrate: async (persistedState: unknown, version: number): Promise<Partial<ItemsState>> => {
      migrate: (persistedState: unknown, version: number): Partial<ItemsState> => {
        let finalState;

        if (version === -1) {
          finalState = persistedState;
        }

        // if (version === 0) {
        //   finalState = await migrateItems(persistedState);
        // }

        return finalState as Partial<ItemsState>;
      },
    },
  ),
);

export default useItemsStore;
