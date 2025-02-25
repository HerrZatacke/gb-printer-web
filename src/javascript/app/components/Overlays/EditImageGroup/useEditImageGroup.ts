import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { randomId } from '../../../../tools/randomId';
import { dateFormat } from '../../../defaults';
import { useGalleryTreeContext } from '../../../contexts/galleryTree';
import { useGalleryParams } from '../../../../hooks/useGalleryParams';
import type { DialogOption } from '../../../../../types/Dialog';
import type { PathMap } from '../../../contexts/galleryTree';
import type { EditGroupInfo } from '../../../stores/editStore';
import type { SerializableImageGroup } from '../../../../../types/ImageGroup';
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
  slugWasChanged: boolean,
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

enum EditMode {
  CREATE_NEW = 'CREATE_NEW',
  EDIT_EXISTING = 'EDIT_EXISTING',
  NOT_EDITING = 'NOT_EDITING',
}

const getEditMode = (editImageGroup: EditGroupInfo | null): EditMode => {
  if (!editImageGroup?.groupId) {
    return EditMode.NOT_EDITING;
  }

  if (editImageGroup.groupId === NEW_GROUP) {
    return EditMode.CREATE_NEW;
  }

  return EditMode.EDIT_EXISTING;
};

interface InitialEditValues {
  imageGroup: SerializableImageGroup | null,
  parentPathMap: PathMap | null,
  title: string,
  slug: string,
  slugTouched: boolean,
}

const useEditImageGroup = (): UseEditImageGroup => {
  const { imageSelection: selection } = useFiltersStore();
  const { editImageGroup, cancelEditImageGroup } = useEditStore();
  const { imageGroups, addImageGroup, updateImageGroup } = useItemsStore();
  const { navigate } = useAbsoluteGroupPath();
  const { view, paths, pathsOptions } = useGalleryTreeContext();
  const { path: currentPath } = useGalleryParams();

  const editMode = getEditMode(editImageGroup);

  const initialValues = useMemo<InitialEditValues>(() => {
    switch (editMode) {
      case EditMode.CREATE_NEW: {
        const title = editImageGroup?.newGroupTitle || '';
        return {
          imageGroup: null,
          parentPathMap: paths.find(({ group }) => group.id === view.id) || null,
          title,
          slug: toSlug(title),
          slugTouched: false,
        };
      }

      case EditMode.EDIT_EXISTING: {
        const imageGroup = imageGroups.find(({ id }) => id === editImageGroup?.groupId) || null;
        return {
          imageGroup,
          parentPathMap: editImageGroup?.groupId ? findParentGroup(paths, editImageGroup.groupId) : null,
          title: imageGroup?.title || '',
          slug: imageGroup?.slug || '',
          slugTouched: true,
        };
      }

      case EditMode.NOT_EDITING:
      default: {
        return {
          imageGroup: null,
          parentPathMap: null,
          title: '',
          slug: '',
          slugTouched: false,
        };
      }
    }
  }, [editImageGroup, editMode, imageGroups, paths, view]);

  const [title, setTitle] = useState<string>(initialValues.title);
  const [slug, setSlug] = useState<string>(initialValues.slug);
  const [slugTouched, setSlugTouched] = useState<boolean>(initialValues.slugTouched);
  const [parentSlug, setParentSlug] = useState<string>(initialValues.parentPathMap?.absolutePath || '/');

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

  // absolute slug already exists
  const slugIsInUse = useMemo(() => (
    !!paths.find(({ absolutePath }) => absolutePath === absoluteSlug)
  ), [absoluteSlug, paths]);

  // slug has changed
  const slugWasChanged = useMemo(() => (
    slug !== initialValues.imageGroup?.slug
  ), [initialValues, slug]);

  const canConfirm = useMemo<boolean>(() => {
    // console.log('canConfirm', { slug, editMode, slugIsInUse, slugWasChanged });
    if (!slug) {
      return false;
    }

    if (editMode === EditMode.CREATE_NEW) {
      return !slugIsInUse;
    }

    if (editMode === EditMode.EDIT_EXISTING) {
      if (!slugWasChanged) {
        return true;
      }

      return !slugIsInUse;
    }

    return false;
  }, [editMode, slug, slugIsInUse, slugWasChanged]);

  const possibleParents = useMemo(() => {
    switch (editMode) {
      case EditMode.EDIT_EXISTING: {
        const editGroupPath = paths.find(({ group }) => group.id === editImageGroup?.groupId)?.absolutePath || '';
        return pathsOptions.filter(({ value }) => (
          !value.startsWith(absoluteSlug) &&
          value !== editGroupPath
        ));
      }

      case EditMode.CREATE_NEW: {
        return pathsOptions;
      }

      case EditMode.NOT_EDITING:
      default: {
        return [];
      }
    }
  }, [absoluteSlug, editImageGroup, editMode, paths, pathsOptions]);

  return {
    editId: editImageGroup?.groupId || null,
    absoluteSlug,
    possibleParents,
    slug,
    title,
    canConfirm,
    slugIsInUse,
    slugWasChanged,
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

      const parentGroupId = paths.find(({ absolutePath }) => absolutePath === parentSlug)?.group.id || '';

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
            coverImage: editImageGroup.newGroupCover,
            images: selection,
            groups: [],
          },
          parentGroupId,
        );
      } else {
        if (!initialValues.imageGroup) {
          return;
        }

        updateImageGroup(
          {
            ...initialValues.imageGroup,
            slug,
            title,
          },
          parentGroupId,
        );
      }

      navigate(slug, parentGroupId);
    },
    cancelEditImageGroup,
  };
};

export default useEditImageGroup;
