import  { type PathMap } from '@/types/galleryTreeContext';
import  { type NewTreeImageGroup } from '@/types/ImageGroup';
import type { DialogOption } from '@/types/Dialog';

export const reducePaths = (prefix: string, groups: NewTreeImageGroup[], usedPaths: Set<string>): PathMap[] => {
  const reducedPaths = groups.reduce((acc: PathMap[], group: NewTreeImageGroup): PathMap[] => {
    const cleanSlug = group.slug.replace(/[^A-Z0-9_-]+/gi, '_');

    let count = 0;
    let absolute = `${prefix}${cleanSlug}/`;

    while (usedPaths.has(absolute)) {
      count += 1;
      absolute = `${prefix}${cleanSlug}_${count}/`;
    }

    usedPaths.add(absolute);

    return ([
      ...acc,
      {
        absolutePath: absolute,
        group,
      },
      ...reducePaths(absolute, group.groups, usedPaths),
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
  }, [{
    value: '',
    name: '/',
  }]);
};
