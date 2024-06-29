import type { TreeImageGroup } from '../../../../types/ImageGroup';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import { useGalleryParams } from '../../../hooks/useGalleryParams';

interface UseGalleryGroup {
  group: TreeImageGroup | null,
  path: string | null,
}

export const useGalleryGroup = (hash: string): UseGalleryGroup => {
  const { paths } = useGalleryTreeContext();
  const { path: viewPath } = useGalleryParams();

  const path = Object.keys(paths)
    .reduce((acc: string | null, reducePath: string): string | null => {
      if (acc) {
        return acc;
      }

      // if two groups use the same coverimage, this may
      // cause the wrong link to be generated. Maybe a ToDo?
      // depending on order of creation of the groups
      if (paths[reducePath].coverImage === hash && reducePath !== viewPath) {
        return reducePath;
      }

      return null;
    }, null);

  const group = path ? paths[path] : null;

  return { group, path };
};
