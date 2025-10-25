import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAvailableTags } from '@/hooks/useAvailableTags';
import useFiltersStore from '@/stores/filtersStore';
import useItemsStore from '@/stores/itemsStore';
import sortBy, { SortDirection } from '@/tools/sortby';
import unique from '@/tools/unique';
import { type Frame } from '@/types/Frame';
import { type Palette } from '@/types/Palette';

export enum ActiveFilterUpdateMode {
  ADD = 'add',
  REMOVE = 'remove',
}

interface FilterFrameInfo {
  usage: number,
  frame: Frame,
}

const sortByUsage = sortBy<FilterFrameInfo>('usage', SortDirection.DESC);

interface UseFilterForm {
  visible: boolean,
  availableTags: string[],
  availableFrames: FilterFrameInfo[],
  availablePalettes: Palette[],
  activeTags: string[],
  activeFrames: string[],
  activePalettes: string[],
  updateActiveTags: (tag: string, mode: ActiveFilterUpdateMode) => void,
  updateActivePalettes: (palette: string, mode: ActiveFilterUpdateMode) => void,
  updateActiveFrames: (frame: string, mode: ActiveFilterUpdateMode) => void,
  applyClearTags: () => void,
  clearTags: () => void,
  clearPalettes: () => void,
  clearFrames: () => void,
  cancel: () => void,
  confirm: () => void,
}

export const useFilterForm = (): UseFilterForm => {
  const {
    filtersTags: stateTags,
    filtersFrames: stateFrames,
    filtersPalettes: statePalettes,
    filtersVisible: visible,
    setFiltersVisible,
    setFilters,
  } = useFiltersStore();

  const { frames, images, palettes } = useItemsStore();

  const [activeTags, setActiveTags] = useState(stateTags);
  const [activeFrames, setActiveFrames] = useState(stateFrames);
  const [activePalettes, setActivePalettes] = useState(statePalettes);

  const { availableTags } = useAvailableTags();

  const availableFrames = useMemo<FilterFrameInfo[]>(() => (
    sortByUsage(
      frames
        .map((frame): FilterFrameInfo => {
          const usage = images.filter((image) => image.frame === frame.id).length;
          return ({
            frame,
            usage,
          });
        })
        .filter(({ frame, usage }) => (
          usage > 0 || activeFrames.includes(frame.id)
        )),
    )
  ), [activeFrames, frames, images]);

  useEffect(() => {
    setActiveTags(stateTags);
    setActiveFrames(stateFrames);
    setActivePalettes(statePalettes);
  }, [stateFrames, statePalettes, stateTags]);

  const updateActiveTags = useCallback((tag: string, mode: ActiveFilterUpdateMode) => {
    setActiveTags(mode === ActiveFilterUpdateMode.ADD ? unique([...activeTags, tag]) : activeTags.filter((t) => t !== tag));
  }, [activeTags]);

  const updateActivePalettes = useCallback((palette: string, mode: ActiveFilterUpdateMode) => {
    setActivePalettes(mode === ActiveFilterUpdateMode.ADD ? unique([...activePalettes, palette]) : activePalettes.filter((t) => t !== palette));
  }, [activePalettes]);

  const updateActiveFrames = useCallback((frame: string, mode: ActiveFilterUpdateMode) => {
    setActiveFrames(mode === ActiveFilterUpdateMode.ADD ? unique([...activeFrames, frame]) : activeFrames.filter((t) => t !== frame));
  }, [activeFrames]);

  return {
    visible,
    availableTags,
    availableFrames,
    availablePalettes: palettes,
    activeTags,
    activeFrames,
    activePalettes,
    updateActiveTags,
    updateActivePalettes,
    updateActiveFrames,
    applyClearTags: () => setFilters([], [], []),
    clearTags: () => setActiveTags([]),
    clearPalettes: () => setActivePalettes([]),
    clearFrames: () => setActiveFrames([]),
    confirm: () => setFilters(activeTags, activePalettes, activeFrames),
    cancel: () => setFiltersVisible(false),
  };
};
