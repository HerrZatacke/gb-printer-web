import type { TreeImageGroup } from '../../../../types/ImageGroup';
import { useGalleryTreeContext } from '../../contexts/galleryTree';

interface UseGalleryGroup {
  group: TreeImageGroup | null,
  path: string | null,
}

export const useGalleryGroup = (hash: string): UseGalleryGroup => {
  const { paths } = useGalleryTreeContext();

  const path = Object.keys(paths)
    .reduce((acc: string | null, reducePath: string): string | null => {
      if (acc) {
        return acc;
      }

      if (paths[reducePath].coverImage === hash) {
        return reducePath;
      }

      return null;
    }, null);

  const group = path ? paths[path] : null;

  return { group, path };
};
