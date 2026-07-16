import { useMemo } from 'react';
import { SpecialTags } from '@/consts/SpecialTags';
import { useImages } from '@/hooks/useImages';

export const getAvailableTags = (allTags: string[]): string[] => {
  const tagSet = new Set<string>(allTags);

  tagSet.delete(SpecialTags.FILTER_FAVOURITE);

  return Array.from(tagSet).sort((a, b) => (
    a.toLowerCase().localeCompare(b.toLowerCase())
  ));
};

export interface UseAvailableTags {
  availableTags: string[];
}

export const useAvailableTags = (): UseAvailableTags => {
  const { allTags } = useImages({ allTags: true });

  const availableTags = useMemo(() => getAvailableTags(allTags), [allTags]);

  return { availableTags };
};
