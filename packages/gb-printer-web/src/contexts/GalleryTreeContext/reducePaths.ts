import { type DialogOption } from '@/types/Dialog';
import { type TreeImageGroup } from '@/types/ImageGroup';

export const collectGroupsByFullSlug = (
  groups: TreeImageGroup[],
  groupsByFullSlug: Map<string, TreeImageGroup> = new Map(),
): Map<string, TreeImageGroup> => {
  groups.forEach((group) => {
    groupsByFullSlug.set(group.fullSlug, group);
    collectGroupsByFullSlug(group.groups, groupsByFullSlug);
  });

  return groupsByFullSlug;
};

export const collectGroupsById = (
  groups: TreeImageGroup[],
  groupsById: Map<string, TreeImageGroup> = new Map(),
): Map<string, TreeImageGroup> => {
  groups.forEach((group) => {
    groupsById.set(group.id, group);
    collectGroupsById(group.groups, groupsById);
  });

  return groupsById;
};

export const reducePathsOptions = (groupsByFullSlug: Map<string, TreeImageGroup>): DialogOption[] => {
  return [...groupsByFullSlug.entries()].reduce((acc: DialogOption[], [absolutePath, group]): DialogOption[] => {
    const depth = absolutePath.split('/').length - 1;
    const indent = Array(depth).fill('\u2007').join('');

    return [
      ...acc,
      {
        value: absolutePath,
        name: `${indent}${group.title} (${absolutePath.replace(/\/$/, '') || '/'})`,
      },
    ];
  }, []);
};
