import { joinURL, withLeadingSlash, cleanDoubleSlashes } from 'ufo';
import { type TreeImageGroup } from '@/types/ImageGroup';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';

export const applyFullSlugs = (
  group: TreeImageGroup,
  parentFullSlug: string = '',
): TreeImageGroup => {
  const isRoot = group.id === ROOT_ID;
  const segment = group.slug || group.id;

  const fullSlug = isRoot ? '/' : cleanDoubleSlashes(withLeadingSlash(joinURL(parentFullSlug, segment)));

  return {
    ...group,
    fullSlug,
    groups: group.groups.map((child) => applyFullSlugs(child, fullSlug)),
  };
};
