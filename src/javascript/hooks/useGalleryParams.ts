import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

interface UseGalleryParams {
  pageIndex: number,
  path: string,
  lastGalleryLink: string,
}

export const useGalleryParams = (): UseGalleryParams => {
  const { '*': gallerySlug } = useParams();

  const [lastGalleryLink, setLastGalleryLink] = useState<string>('');

  const galleryPathRegex = /(?<slug>.*\/)*(page\/)(?<page>\d*)/g;

  const match = galleryPathRegex.exec(gallerySlug || '');

  const pageParam = match?.groups?.page;
  const path = match?.groups?.slug || '';
  const pageIndex = pageParam ? parseInt(pageParam, 10) - 1 : 0;

  useEffect(() => {
    if (typeof gallerySlug === 'string') {
      const link = `/gallery/${path}page/${pageIndex + 1}`;
      setLastGalleryLink(link);
    }
  }, [path, pageIndex, gallerySlug]);

  return {
    pageIndex,
    path,
    lastGalleryLink,
  };
};
