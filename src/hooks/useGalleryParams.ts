import { useEffect, useState, useCallback } from 'react';
import { useUrl } from '@/hooks/useUrl';

const GALLERY_BASE_PATH = '/gallery';

interface GetUrlParams {
  pageIndex?: number,
  group?: string,
}

interface UseGalleryParams {
  pageIndex: number,
  path: string,
  lastGalleryLink: string,
  getUrl: (params: GetUrlParams) => string,
}

export const useGalleryParams = (): UseGalleryParams => {
  const { searchParams, pathname } = useUrl();
  const [lastGalleryLink, setLastGalleryLink] = useState<string>('');

  const pageIndex = parseInt(searchParams.get('page') ?? '1', 10) - 1;
  const path = searchParams.get('group') || '';

  const getUrl = useCallback((params: GetUrlParams) => {
    const page: number = typeof params.pageIndex === 'number' ? params.pageIndex : pageIndex;
    const group: string = typeof params.group === 'string' ? params.group : path;

    let link = `${GALLERY_BASE_PATH}?page=${page + 1}`;
    if (group.length) {
      link = `${link}&group=${group}`;
    }

    return link;
  }, [pageIndex, path]);

  useEffect(() => {
    if (pathname === GALLERY_BASE_PATH) {
      const link = getUrl({ pageIndex , group: path });
      setLastGalleryLink(link);
    }
  }, [path, pageIndex, pathname, getUrl]);

  return {
    pageIndex,
    path,
    lastGalleryLink,
    getUrl,
  };
};
