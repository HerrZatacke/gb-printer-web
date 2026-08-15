import { TreeImageGroup } from 'gb-printer-schemas';

export const applyImageTotals = (group: TreeImageGroup): TreeImageGroup => {
  const groups = group.groups.map(applyImageTotals);
  const totalImages = group.images.length + groups.reduce((sum, child) => sum + child.totalImages, 0);

  return { ...group, groups, totalImages };
};
