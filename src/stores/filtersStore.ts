import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import dayjs from 'dayjs';
import { PROJECT_PREFIX } from './constants';
import type { RecentImport } from '../../../types/Sync';
import type { Image } from '../../../types/Image';
import uniqueBy from '../../tools/unique/by';
import { isRGBNImage } from '../../tools/isRGBNImage';
import unique from '../../tools/unique';

export enum ImageSelectionMode {
  ADD = 'add',
  REMOVE = 'remove',
}

interface Values {
  filtersActiveTags: string[],
  filtersVisible: boolean,
  imageSelection: string[],
  lastSelectedImage: string | null,
  recentImports: RecentImport[],
  sortBy: string,
  sortOptionsVisible: boolean,
}

interface Actions {
  cleanRecentImports: (imageHashes: string[]) => void,
  setFiltersActiveTags: (filtersActiveTags: string[]) => void,
  setFiltersVisible: (filtersVisible: boolean) => void,
  setImageSelection: (imageSelection: string[]) => void,
  updateRecentImports: (images: Image[]) => void,
  setSortBy: (sortBy: string) => void,
  setSortOptionsVisible: (sortOptionsVisible: boolean) => void,
  updateImageSelection: (mode: ImageSelectionMode, hashes: string[]) => void,
}

export type FiltersState = Values & Actions;

const useFiltersStore = create(
  persist<FiltersState>(
    (set, get) => ({
      filtersActiveTags: [],
      filtersVisible: false,
      imageSelection: [],
      lastSelectedImage: null,
      recentImports: [],
      sortBy: 'created_asc',
      sortOptionsVisible: false,

      setFiltersActiveTags: (filtersActiveTags: string[]) => set({ filtersActiveTags, filtersVisible: false }),
      setFiltersVisible: (filtersVisible: boolean) => set({ filtersVisible }),
      setImageSelection: (imageSelection: string[]) => set({ imageSelection, lastSelectedImage: null }),
      setSortBy: (sortBy: string) => set({ sortBy, sortOptionsVisible: false }),
      setSortOptionsVisible: (sortOptionsVisible: boolean) => set({ sortOptionsVisible }),

      cleanRecentImports: (imageHashes: string[]) => {
        const { recentImports } = get();
        const yesterday = dayjs().subtract(6, 'hour').unix();

        set({
          recentImports: recentImports.filter(({ hash, timestamp }) => (
            imageHashes.includes(hash) &&
            timestamp > yesterday
          )),
        });
      },

      updateRecentImports: (images: Image[]) => {
        const currentValue = get().recentImports;

        const recentImports: RecentImport[] = images.reduce((acc: RecentImport[], image: Image) => {
          if (isRGBNImage(image)) {
            return acc;
          }

          return [
            ...acc,
            {
              hash: image.hash,
              timestamp: dayjs().unix(),
            },
          ];
        }, []);

        set({
          recentImports: uniqueBy<RecentImport>('hash')([
            ...currentValue,
            ...recentImports,
          ]),
        });
      },

      updateImageSelection: (mode: ImageSelectionMode, hashes: string[]) => {
        const value = get().imageSelection;
        switch (mode) {
          case ImageSelectionMode.ADD: {
            set({
              imageSelection: unique([...value, ...hashes]),
              lastSelectedImage: hashes[0],
            });
            break;
          }

          case ImageSelectionMode.REMOVE: {
            set({
              imageSelection: value.filter((hash) => !hashes.includes(hash)),
              lastSelectedImage: null,
            });
            break;
          }

          default:
        }
      },
    }),
    {
      name: `${PROJECT_PREFIX}-filters`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useFiltersStore;
