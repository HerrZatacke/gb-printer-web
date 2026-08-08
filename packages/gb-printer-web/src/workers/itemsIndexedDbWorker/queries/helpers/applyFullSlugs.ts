import { joinURL } from 'ufo';
import { cleanFullSlug } from '@/tools/cleanSlug';
import { type TreeImageGroup } from '@/types/ImageGroup';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';

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
