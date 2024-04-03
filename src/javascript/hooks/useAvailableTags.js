import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import unique from '../tools/unique';
import { SpecialTags } from '../consts/SpecialTags';

export const getAvailableTags = (images) => unique(images.map(({ tags }) => tags).flat())
  .filter((tag) => tag !== SpecialTags.FILTER_FAVOURITE)
  .sort((a, b) => (
    a.toLowerCase().localeCompare(b.toLowerCase())
  ));

export const useAvailableTags = () => {
  const images = useSelector((state) => state.images);
  const [availableTags, setAvailableTags] = useState(getAvailableTags(images));

  useEffect(() => {
    setAvailableTags(getAvailableTags(images));
  }, [images]);

  return { availableTags };
};
