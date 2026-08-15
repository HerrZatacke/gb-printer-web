import { type TreeImageGroup } from 'gb-printer-schemas';
import { joinURL } from 'ufo';
import { ROOT_ID } from '@/queries/helpers/createTreeRoot';
import { cleanFullSlug } from '@/temptools/cleanSlug';

export const applyFullSlugs = (
  group: TreeImageGroup,
  parentFullSlug = '',
  usedFullSlugs = new Set<string>(),
): TreeImageGroup => {
  const isRoot = group.id === ROOT_ID;
  const segment = group.slug || group.id;

  let fullSlug = isRoot ? '/' : cleanFullSlug(joinURL(parentFullSlug, segment));

  if (!isRoot) {
    let count = 0;

    while (usedFullSlugs.has(fullSlug)) {
      console.warn(`usedFullSlugs.has(${fullSlug})`);
      count += 1;
      fullSlug = cleanFullSlug(joinURL(parentFullSlug, `${segment}_${count}`));
    }
  }

  usedFullSlugs.add(fullSlug);

  return {
    ...group,
    fullSlug,
    groups: group.groups.map((child) => applyFullSlugs(child, fullSlug, usedFullSlugs)),
  };
};
