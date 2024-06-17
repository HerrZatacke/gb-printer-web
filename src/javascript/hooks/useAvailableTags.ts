import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import unique from '../tools/unique';
import { SpecialTags } from '../consts/SpecialTags';
import { State } from '../app/store/State';
import { Image } from '../../types/Image';

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
  const images = useSelector((state: State) => state.images);
  const [availableTags, setAvailableTags] = useState<string[]>(getAvailableTags(images));

  useEffect(() => {
    setAvailableTags(getAvailableTags(images));
  }, [images]);

  return { availableTags };
};
