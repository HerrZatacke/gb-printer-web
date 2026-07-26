import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  collectGroupsByFullSlug,
  collectGroupsById,
  reducePathsOptions,
} from '@/contexts/GalleryTreeContext/reducePaths';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useImages } from '@/hooks/useImages';
import { useUrl } from '@/hooks/useUrl';
import { DialogOption } from '@/types/Dialog';
import {
  type GetUrlParams,
  type GalleryTreeContextType,
} from '@/types/galleryTreeContext';
import { type TreeImageGroup } from '@/types/ImageGroup';

const GALLERY_BASE_PATH = '/gallery/';

export const useContextHook = (): GalleryTreeContextType => {
  const { imageGroupTree: root, isLoadingTree } = useImageGroups({ tree: true, list: true });
  const { searchParams, pathname } = useUrl();
  const [lastGalleryLink, setLastGalleryLink] = useState<string>('');

  const groupsByFullSlug = useMemo<Map<string, TreeImageGroup>>(() => {
    return root ? collectGroupsByFullSlug([root]): new Map();
  }, [root]);

  const groupsById = useMemo<Map<string, TreeImageGroup>>(() => {
    return root ? collectGroupsById([root]): new Map();
  }, [root]);

  const pathsOptions = useMemo<DialogOption[]>(() => {
    return reducePathsOptions(groupsByFullSlug);
  }, [groupsByFullSlug]);


  const currentPageIndex = useMemo(() => (parseInt(searchParams.get('page') ?? '1', 10) - 1), [searchParams]);
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
    groupsByFullSlug,
    groupsById,
    images,
    pathsOptions,
    isWorking: isLoadingTree || isLoadingByGroupId || isLoadingByFullSlug,
    paging: byGroupPaging,
    path,
    lastGalleryLink,
    getUrl,
  };
};
