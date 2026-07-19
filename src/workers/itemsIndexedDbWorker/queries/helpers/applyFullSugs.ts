import { joinURL, withLeadingSlash, cleanDoubleSlashes } from 'ufo';
import { ROOT_ID } from '@/tools/createTreeRoot';
import { type NewTreeImageGroup } from '@/types/ImageGroup';

export const applyFullSlugs = (
  group: NewTreeImageGroup,
  parentFullSlug: string = '',
): NewTreeImageGroup => {
  const isRoot = group.id === ROOT_ID;
  const segment = group.slug || group.id;

  const fullSlug = isRoot ? '/' : cleanDoubleSlashes(withLeadingSlash(joinURL(parentFullSlug, segment)));

  return {
    ...group,
    fullSlug,
    groups: group.groups.map((child) => applyFullSlugs(child, fullSlug)),
  };
};
