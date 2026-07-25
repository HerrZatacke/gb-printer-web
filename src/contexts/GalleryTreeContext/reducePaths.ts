import { cleanFullSlug, cleanSlug } from '@/tools/cleanSlug';
import { type DialogOption } from '@/types/Dialog';
import { type PathMap } from '@/types/galleryTreeContext';
import { type TreeImageGroup } from '@/types/ImageGroup';

export const reducePaths = (groups: TreeImageGroup[], prefix = '/', usedPaths = new Set<string>()): PathMap[] => {
  const reducedPaths = groups.reduce((acc: PathMap[], group: TreeImageGroup): PathMap[] => {
    const cleanedSlug = cleanSlug(group.slug);

    let count = 0;
    let absolute = cleanFullSlug(`${prefix}/${cleanedSlug}`);

    while (usedPaths.has(absolute)) {
      count += 1;
      absolute = cleanFullSlug(`${prefix}/${cleanedSlug}_${count}`);
    }

    usedPaths.add(absolute);

    return ([
      ...acc,
      {
        absolutePath: absolute,
        group,
      },
      ...reducePaths(group.groups, absolute, usedPaths),
    ]);
  }, []);

  return reducedPaths;
};

export const reducePathsOptions = (paths: PathMap[]) => {
  return paths.reduce((acc: DialogOption[], { group, absolutePath }): DialogOption[] => {
    const depth = absolutePath.split('/').length - 1;
    const indent = Array(depth).fill('\u2007').join('');

    return [
      ...acc,
      {
        value: absolutePath,
        name: `${indent}${group.title} (/${absolutePath.replace(/\/$/, '')})`,
      },
    ];
  }, []);
};
