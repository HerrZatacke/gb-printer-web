import { useState, useEffect } from 'react';
import unique from '../tools/unique';
import useItemsStore from '../app/stores/itemsStore';
import { SpecialTags } from '../consts/SpecialTags';
import type { Image } from '../../types/Image';

export const getAvailableTags = (images: Image[]): string[] => {
  const allTags = unique(images.map(({ tags }) => tags).flat());
  return allTags
    .filter((tag) => tag !== SpecialTags.FILTER_FAVOURITE)
    .sort((a, b) => (
      a.toLowerCase().localeCompare(b.toLowerCase())
    ));
};

export interface UseAvailableTags {
  availableTags: string[],
}

export const useAvailableTags = (): UseAvailableTags => {
  const { images } = useItemsStore();
  const [availableTags, setAvailableTags] = useState<string[]>(getAvailableTags(images));

  useEffect(() => {
    setAvailableTags(getAvailableTags(images));
  }, [images]);

  return { availableTags };
};
