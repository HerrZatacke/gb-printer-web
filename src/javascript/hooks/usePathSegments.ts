import { useMemo } from 'react';
import { useGalleryParams } from './useGalleryParams';
import { useGalleryTreeContext } from '../app/contexts/galleryTree';
import { useNavigationTools } from '../app/contexts/navigationTools';
import type { TreeImageGroup } from '../../types/ImageGroup';
import type { PathMap } from '../app/contexts/galleryTree';

export interface Segment {
  group: TreeImageGroup,
  path: string,
}

export interface UsePathSegments {
  segments: Segment[],
}

export const usePathSegments = (): UsePathSegments => {
  const { path: currentPath } = useGalleryParams();
  const { root, paths } = useGalleryTreeContext();
  const { getImagePageIndexInGroup } = useNavigationTools();

  const segments = useMemo<Segment[]>(() => {
    const breadCrumbsRaw = ['', ...currentPath.split('/').filter(Boolean)];

    const breadCrumbSlugs = breadCrumbsRaw.reduce((acc: string[], path: string, index: number): string[] => ([
      ...acc,
      breadCrumbsRaw.slice(1, index + 1).join('/').concat('/'),
    ]), []);

    const breadCrumbPaths: PathMap[] = breadCrumbSlugs.map((breadCrumbPath): PathMap => (
      paths.find(({ absolutePath }) => absolutePath === breadCrumbPath) || {
        absolutePath: '',
        group: root,
      }
    ));

    const breadCrumbSegments = breadCrumbPaths.map((breadCrumbPath: PathMap, index: number): Segment => {
      const childPath = breadCrumbPaths[index + 1];

      let parentPageIndex = 1;

      if (childPath) {
        const childCoverImage = childPath.group.coverImage;
        parentPageIndex = getImagePageIndexInGroup(childCoverImage, breadCrumbPath.group);
      }

      return {
        group: breadCrumbPath.group,
        path: `${breadCrumbPath.absolutePath}page/${parentPageIndex}`,
      };
    });

    return breadCrumbSegments;
  }, [currentPath, getImagePageIndexInGroup, paths, root]);

  return {
    segments,
  };
};
