import { useCallback, useEffect, useMemo, useState } from 'react';
import { reducePaths, reducePathsOptions } from '@/contexts/GalleryTreeContext/reducePaths';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useImages } from '@/hooks/useImages';
import { useUrl } from '@/hooks/useUrl';
import {
  type GetUrlParams,
  type GalleryTreeContextType,
  type PathMap,
} from '@/types/galleryTreeContext';

const GALLERY_BASE_PATH = '/gallery/';

export const useContextHook = (): GalleryTreeContextType => {
  const { imageGroupTree: root, isLoadingTree } = useImageGroups({ tree: true, list: true });
  const { searchParams, pathname } = useUrl();
  const [lastGalleryLink, setLastGalleryLink] = useState<string>('');

  // ToDo: Can we eliminate needing "paths"?
  const paths = useMemo<PathMap[]>(() => {
    if (!root) {
      return [];
    }

    const usedPaths = new Set<string>();
    return reducePaths('', [root], usedPaths);
  }, [root]);

  // ToDo: Can we eliminate needing "pathsOptions" (or move it to dedicated component which needs it)?
  const pathsOptions = useMemo(() => {
    return reducePathsOptions(paths);
  }, [paths]);


  const currentPageIndex = parseInt(searchParams.get('page') ?? '1', 10) - 1;

  const path = useMemo(() => (searchParams.get('group') || ''), [searchParams]);

  const getUrl = useCallback((params: GetUrlParams) => {
    const page: number = typeof params.pageIndex === 'number' ? params.pageIndex : currentPageIndex;
    let group: string = typeof params.group === 'string' ? params.group : path;

    if (group === '/') {
      group = '';
    }

    let link = `${GALLERY_BASE_PATH}?page=${page + 1}`;
    if (group.length) {
      link = `${link}&group=${encodeURIComponent(group)}`;
    }

    return link;
  }, [currentPageIndex, path]);

  useEffect(() => {
    if (pathname === GALLERY_BASE_PATH) {
      const handle = window.setTimeout(() => {
        const link = getUrl({ group: path });
        setLastGalleryLink(link);
      }, 1);

      return () => window.clearTimeout(handle);
    }

    return () => {/**/};
  }, [path, pathname, getUrl]);

  const { byFullSlug: view, isLoadingByFullSlug } = useImageGroups({ bySlug: path });

  const covers = view?.groups.map(({ coverImage }) => coverImage) || [];

  const { byGroupId: viewItems, byGroupPaging, isLoadingByGroupId } = useImages({
    page: currentPageIndex,
    groupId: view?.id,
    keepPreviousData: false,
  });

  const images = viewItems.map(({ image }) => image);

  // useEffect(() => {
  //   console.log(`🦚 ${Math.round(performance.now())} page/path`, { currentPageIndex, path });
  // }, [currentPageIndex, path]);
  //
  // useEffect(() => {
  //   console.log(`🦚 ${Math.round(performance.now())} view: ${view?.id}: `, { view });
  // }, [view]);
  //
  // useEffect(() => {
  //   console.log(`🦚 ${Math.round(performance.now())} images`, images);
  // }, [images]);

  return {
    view,
    covers,
    paths,
    images,
    pathsOptions,
    isWorking: isLoadingTree || isLoadingByGroupId || isLoadingByFullSlug,
    paging: byGroupPaging,
    path,
    lastGalleryLink,
    getUrl,
  };
};
