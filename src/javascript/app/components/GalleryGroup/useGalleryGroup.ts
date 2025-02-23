import type { TreeImageGroup } from '../../../../types/ImageGroup';
import { useGalleryTreeContext } from '../../contexts/galleryTree';

interface UseGalleryGroup {
  group: TreeImageGroup | null,
  path: string | null,
}

export const useGalleryGroup = (hash: string): UseGalleryGroup => {
  const { paths, view } = useGalleryTreeContext();

  const group: TreeImageGroup | null = view.groups.find(({ coverImage }) => coverImage === hash) || null;

  const path: string | null = paths.find(({ group: { id } }) => (id === group?.id))?.absolutePath || null;

  return { group, path };
};
