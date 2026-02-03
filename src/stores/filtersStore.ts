import dayjs from 'dayjs';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { isRGBNImage } from '@/tools/isRGBNImage';
import unique from '@/tools/unique';
import uniqueBy from '@/tools/unique/by';
import type { Image } from '@/types/Image';
import type { RecentImport } from '@/types/Sync';
import { PROJECT_PREFIX } from './constants';

export enum ImageSelectionMode {
  ADD = 'add',
  REMOVE = 'remove',
}

interface Values {
  filtersTags: string[],
  filtersPalettes: string[],
  filtersFrames: string[],
  filtersVisible: boolean,
  imageSelection: string[],
  lastSelectedImage: string | null,
  recentImports: RecentImport[],
  sortBy: string,
  sortOptionsVisible: boolean,
}

interface Actions {
  cleanRecentImports: (imageHashes: string[]) => void,
  setFilters: (filtersTags: string[], filtersPalettes: string[], filtersFrames: string[]) => void,
  setFiltersVisible: (filtersVisible: boolean) => void,
  setImageSelection: (imageSelection: string[]) => void,
  updateRecentImports: (images: Image[]) => void,
  setSortBy: (sortBy: string) => void,
  setSortOptionsVisible: (sortOptionsVisible: boolean) => void,
  updateImageSelection: (mode: ImageSelectionMode, hashes: string[]) => void,
}

export type FiltersState = Values & Actions;

export const createFiltersStore = () => (
  create(
    persist<FiltersState>(
      (set, get) => ({
        filtersTags: [],
        filtersPalettes: [],
        filtersFrames: [],
        filtersVisible: false,
        imageSelection: [],
        lastSelectedImage: null,
        recentImports: [],
        sortBy: 'created_asc',
        sortOptionsVisible: false,

        setFilters: (filtersTags: string[], filtersPalettes: string[], filtersFrames: string[]) => {
          set({
            filtersTags,
            filtersPalettes,
            filtersFrames,
            filtersVisible: false,
          });
        },

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
  )
);
