import { NewTreeImageGroup } from '@/types/ImageGroup';

export const applyImageTotals = (group: NewTreeImageGroup): NewTreeImageGroup => {
  const groups = group.groups.map(applyImageTotals);
  const totalImages = group.images.length + groups.reduce((sum, child) => sum + child.totalImages, 0);

  return { ...group, groups, totalImages };
};
