import { useNavigate } from 'react-router-dom';
import { useGalleryTreeContext } from '../app/contexts/galleryTree';

interface UseAbsoluteGroupPath {
  getPath: (slug: string, viewId: string) => string,
  navigate: (slug: string, viewId: string) => void,
}

export const useAbsoluteGroupPath = (): UseAbsoluteGroupPath => {
  const routerNavigate = useNavigate();
  const { paths } = useGalleryTreeContext();

  const getPath = (slug: string, viewId: string) => {
    const viewSlug = paths.find(({ group: { id } }) => (viewId === id))?.absolutePath || '';

    return `/gallery/${viewSlug}${slug}/page/1`;
  };


  const navigate = (slug: string, viewId: string) => {
    routerNavigate(getPath(slug, viewId));
  };

  return {
    getPath,
    navigate,
  };
};
