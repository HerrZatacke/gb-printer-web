import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { randomId } from '../../../../tools/randomId';
import { dateFormat } from '../../../defaults';
import { useGalleryTreeContext } from '../../../contexts/galleryTree';
import { useGalleryParams } from '../../../../hooks/useGalleryParams';
import type { DialogOption } from '../../../../../types/Dialog';
import type { PathMap } from '../../../contexts/galleryTree';
import useEditStore from '../../../stores/editStore';
import useFiltersStore from '../../../stores/filtersStore';
import useItemsStore from '../../../stores/itemsStore';
import { useAbsoluteGroupPath } from '../../../../hooks/useAbsoluteGroupPath';

export const NEW_GROUP = 'NEW_GROUP';

interface UseEditImageGroup {
  editId: string | null,
  absoluteSlug: string,
  possibleParents: DialogOption[],
  slug: string,
  title: string,
  canConfirm: boolean,
  slugIsInUse: boolean,
  parentSlug: string,
  setSlug: (slug: string) => void,
  setTitle: (title: string) => void,
  setParentSlug: (slug: string) => void
  confirm: () => void,
  cancelEditImageGroup: () => void,
}

export const toSlug = (title: string): string => (
  title.trim().replace(/[^A-Z0-9_-]+/gi, '_').toLowerCase()
);

const findParentGroup = (paths: PathMap[], groupId: string): PathMap | null => (
  paths.find(({ group: { groups } }) => (
    groups.find(({ id }) => (
      id === groupId
    ))
  )) || null
);

const useEditImageGroup = (): UseEditImageGroup => {
  const { imageSelection: selection } = useFiltersStore();
  const { editImageGroup, cancelEditImageGroup } = useEditStore();
  const { imageGroups, addImageGroup, updateImageGroup } = useItemsStore();

  const imageGroup = imageGroups.find(({ id }) => id === editImageGroup?.groupId) || null;

  const { view, paths, pathsOptions } = useGalleryTreeContext();
  const { path: currentPath } = useGalleryParams();

  const { navigate } = useAbsoluteGroupPath();

  const [title, setTitle] = useState<string>(imageGroup?.title || editImageGroup?.newGroupTitle || '');
  const [slug, setSlug] = useState<string>(imageGroup?.slug || toSlug(title));
  const [slugTouched, setSlugTouched] = useState<boolean>(Boolean(imageGroup));

  const [parentSlug, setParentSlug] = useState<string>(findParentGroup(paths, editImageGroup?.groupId || '')?.absolutePath || '');

  const absoluteSlug = useMemo(() => {
    if (!editImageGroup?.groupId) {
      return '';
    }

    if (editImageGroup?.groupId === NEW_GROUP) {
      return `${currentPath}${slug}/`;
    }

    const parentGroup = findParentGroup(paths, editImageGroup.groupId);

    const parentPath = parentGroup?.absolutePath || '';

    return `${parentPath}${slug}/`;
  }, [editImageGroup, paths, currentPath, slug]);

  const slugIsInUse = !!paths.find(({ absolutePath }) => absolutePath === absoluteSlug); // absolute slug already exists

  const canConfirm = !(
    slug.length === 0 || // no slug entered
    (
      slug !== imageGroup?.slug && // slug has changed
      slugIsInUse
    )
  );

  const possibleParents = pathsOptions.filter(({ value }) => !value.startsWith(absoluteSlug));

  return {
    editId: editImageGroup?.groupId || null,
    absoluteSlug,
    possibleParents,
    slug,
    title,
    canConfirm,
    slugIsInUse,
    parentSlug,
    setSlug: (newSlug: string) => {
      setSlug(newSlug);
      setSlugTouched(true);
    },
    setTitle: (newTitle: string) => {
      setTitle(newTitle);
      if (newTitle.length < 2 || !slugTouched) {
        setSlugTouched(false);
        setSlug(toSlug(newTitle));
      }
    },
    setParentSlug,
    confirm: () => {
      cancelEditImageGroup();

      if (!canConfirm) {
        return;
      }

      if (editImageGroup?.groupId === NEW_GROUP) {
        if (!editImageGroup?.newGroupCover) {
          return;
        }

        addImageGroup(
          {
            id: randomId(),
            slug,
            title,
            created: dayjs(Date.now()).format(dateFormat),
            coverImage: editImageGroup?.newGroupCover,
            images: selection,
            groups: [],
          },
          view.id,
        );

        navigate(slug, view.id);
      } else {
        if (!imageGroup) {
          return;
        }

        const parentGroupId = paths.find(({ absolutePath }) => absolutePath === parentSlug)?.group.id || '';

        updateImageGroup(
          {
            ...imageGroup,
            slug,
            title,
          },
          parentGroupId,
        );

        navigate(slug, parentGroupId);
      }
    },
    cancelEditImageGroup,
  };
};

export default useEditImageGroup;
