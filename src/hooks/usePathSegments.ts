import { useEffect, useMemo } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { useNavigationToolsContext } from '@/contexts/navigationTools/NavigationToolsProvider';
import { PathMap } from '@/types/galleryTreeContext';
import { type TreeImageGroup } from '@/types/ImageGroup';

export interface Segment {
  group: TreeImageGroup,
  link: string,
}

export interface UsePathSegments {
  segments: Segment[],
}

export const usePathSegments = (): UsePathSegments => {
  const { path: currentPath, getUrl, root, paths, isInitialized } = useGalleryTreeContext();
  const { getImagePageIndexInGroup, navigateToGroup } = useNavigationToolsContext();

  const breadCrumbSlugs = useMemo(() => {
    const breadCrumbsRaw = ['', ...currentPath.split('/').filter(Boolean)];

    return breadCrumbsRaw.reduce((acc: string[], path: string, index: number): string[] => ([
      ...acc,
      breadCrumbsRaw.slice(1, index + 1).join('/').concat('/'),
    ]), []);
  }, [currentPath]);

  const segments = useMemo<Segment[]>(() => {
    const breadCrumbPaths: PathMap[] = breadCrumbSlugs.reduce((acc: PathMap[], breadCrumbPath): PathMap[] => {
      let segmentPath: PathMap | undefined;

      if (breadCrumbPath === '/') {
        segmentPath = { absolutePath: '', group: root };
      } else {
        segmentPath = paths.find(({ absolutePath }) => absolutePath === breadCrumbPath);
      }

      return segmentPath ? [...acc, segmentPath] : acc;
    }, []);

    const breadCrumbSegments = breadCrumbPaths.map((breadCrumbPath: PathMap, index: number): Segment => {
      const childPath = breadCrumbPaths[index + 1];

      let parentPageIndex = 0;

      if (childPath) {
        const childCoverImage = childPath.group.coverImage;
        parentPageIndex = getImagePageIndexInGroup(childCoverImage, breadCrumbPath.group);
      }

      return {
        group: breadCrumbPath.group,
        link: getUrl({ pageIndex: parentPageIndex, group: breadCrumbPath.absolutePath }),
      };
    });

    return breadCrumbSegments;
  }, [breadCrumbSlugs, root, paths, getUrl, getImagePageIndexInGroup]);


  useEffect(() => {
    if (!isInitialized) { return; }

    // if url path does not match breadcrumb, navigate to the best possible path instead
    if (breadCrumbSlugs.length !== segments.length) {
      const validGroupId = segments[segments.length - 1].group.id;
      navigateToGroup(validGroupId, 0);
    }
  }, [breadCrumbSlugs.length, isInitialized, navigateToGroup, segments]);

  return {
    segments,
  };
};
