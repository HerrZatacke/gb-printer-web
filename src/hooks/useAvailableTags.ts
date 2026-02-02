import { useState, useEffect } from 'react';
import { SpecialTags } from '@/consts/SpecialTags';
import { useItemsStore } from '@/stores/stores';
import type { Image } from '@/types/Image';

export const getAvailableTags = (images: Image[]): string[] => {
  const tagSet = new Set<string>();

  for (const { tags } of images) {
    for (const tag of tags) {
      if (tag !== SpecialTags.FILTER_FAVOURITE) {
        tagSet.add(tag);
      }
    }
  }

  return Array.from(tagSet).sort((a, b) => (
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
