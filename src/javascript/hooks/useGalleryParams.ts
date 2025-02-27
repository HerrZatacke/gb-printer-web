import { useParams } from 'react-router';

interface UseGalleryParams {
  pageIndex: number,
  path: string,
}

export const useGalleryParams = (): UseGalleryParams => {
  const { '*': gallerySlug } = useParams();
  const galleryPathRegex = /(?<slug>.*\/)*(page\/)(?<page>\d*)/g;

  const match = galleryPathRegex.exec(gallerySlug || '');

  const pageParam = match?.groups?.page;
  const path = match?.groups?.slug || '';

  return {
    pageIndex: pageParam ? parseInt(pageParam, 10) - 1 : 0,
    path,
  };
};
