import { useMemo, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useImageGroups } from '@/hooks/useImageGroups';
import {
  type EditGroupInfo,
  useEditStore,
  useFiltersStore,
} from '@/stores/stores';
import { cleanFullSlug } from '@/tools/cleanSlug';
import { randomId } from '@/tools/randomId';
import { toCreationDate } from '@/tools/toCreationDate';
import { type DialogOption } from '@/types/Dialog';
import { type SerializableImageGroup, TreeImageGroup } from '@/types/ImageGroup';

export const NEW_GROUP = 'NEW_GROUP';

interface UseEditImageGroup {
  editId: string | null;
  absoluteSlug: string;
  possibleParents: DialogOption[];
  slug: string;
  title: string;
  isFavourite: boolean;
  canConfirm: boolean;
  canMove: boolean;
  slugIsInUse: boolean;
  slugWasChanged: boolean;
  parentSlug: string;
  selectionCount: number;
  setSlug: (slug: string) => void;
  setTitle: (title: string) => void;
  setIsFavourite: (isFavourite: boolean) => void;
  setParentSlug: (slug: string) => void;
  confirm: () => Promise<void>;
  move: () => Promise<void>;
  cancelEditImageGroup: () => void;
}

export const toSlug = (title: string): string => (
  title.trim().replace(/[^A-Z0-9_-]+/gi, '_').toLowerCase()
);

const findParentGroup = (groups: TreeImageGroup[], groupId: string): TreeImageGroup | null => {
  const entry = groups.find(({ groups: children }) => children.some(({ id }) => id === groupId));

  return entry ?? null;
};

const EditMode = {
  CREATE_NEW: 'CREATE_NEW',
  EDIT_EXISTING: 'EDIT_EXISTING',
  NOT_EDITING: 'NOT_EDITING',
} as const;
type EditMode = (typeof EditMode)[keyof typeof EditMode];

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
  imageGroup: SerializableImageGroup | null;
  parentGroup: TreeImageGroup | null;
  title: string;
  isFavourite: boolean;
  slug: string;
  slugTouched: boolean;
}

const useEditImageGroup = (): UseEditImageGroup => {
  const { imageSelection: selection } = useFiltersStore();
  const { editImageGroup, cancelEditImageGroup } = useEditStore();
  const { imageGroups, updateImageGroup, moveImagesToGroup } = useImageGroups({ list: true });
  const { navigateToGroup, navigateToImage } = useNavigationTools();
  const { path: currentPath, view, groupsByFullSlug, groupsById, pathsOptions } = useGalleryTreeContext();
  const selectionCount = selection.length;

  const editMode = getEditMode(editImageGroup);

  const initialValues = useMemo<InitialEditValues>(() => {
    switch (editMode) {
      case EditMode.CREATE_NEW: {
        const title = editImageGroup?.newGroupTitle || '';
        return {
          imageGroup: null,
          parentGroup: view ? groupsById.get(view.id) ?? null : null,
          title,
          isFavourite: false,
          slug: toSlug(title),
          slugTouched: false,
        };
      }

      case EditMode.EDIT_EXISTING: {
        const imageGroup = imageGroups.find(({ id }) => id === editImageGroup?.groupId) || null;
        return {
          imageGroup,
          parentGroup: editImageGroup?.groupId ? findParentGroup([...groupsById.values()], editImageGroup.groupId) : null,
          title: imageGroup?.title || '',
          isFavourite: imageGroup?.isFavourite || false,
          slug: imageGroup?.slug || '',
          slugTouched: true,
        };
      }

      case EditMode.NOT_EDITING:
      default: {
        return {
          imageGroup: null,
          parentGroup: null,
          title: '',
          isFavourite: false,
          slug: '',
          slugTouched: false,
        };
      }
    }
  }, [editImageGroup, editMode, imageGroups, groupsById, view]);

  const [title, setTitle] = useState<string>(initialValues.title);
  const [isFavourite, setIsFavourite] = useState<boolean>(initialValues.isFavourite);
  const [slug, setSlug] = useState<string>(initialValues.slug);
  const [slugTouched, setSlugTouched] = useState<boolean>(initialValues.slugTouched);
  const [parentSlug, setParentSlug] = useState<string>(initialValues.parentGroup?.fullSlug || '');

  const absoluteSlug = useMemo(() => {
    if (!editImageGroup?.groupId) {
      return '';
    }

    if (editImageGroup?.groupId === NEW_GROUP) {
      return cleanFullSlug(`${currentPath}/${slug}`);
    }

    return cleanFullSlug(`${parentSlug}/${slug}`);
  }, [editImageGroup?.groupId, parentSlug, slug, currentPath]);

  // absolute slug already exists
  const slugIsInUse = useMemo(() => {
    return groupsByFullSlug.has(absoluteSlug);
  }, [absoluteSlug, groupsByFullSlug]);

  // slug has changed
  const slugWasChanged = useMemo(() => (
    slug !== initialValues.imageGroup?.slug
  ), [initialValues, slug]);

  const canConfirm = useMemo<boolean>(() => {
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

  const canMove = useMemo<boolean>(() => {
    const parentGroupId = groupsByFullSlug.get(parentSlug)?.id ?? '';
    const currentGroupId = initialValues.parentGroup?.id ?? '';
    return currentGroupId !== parentGroupId;
  }, [initialValues, parentSlug, groupsByFullSlug]);

  const possibleParents = useMemo<DialogOption[]>(() => {
    switch (editMode) {
      case EditMode.EDIT_EXISTING: {
        const editGroupPath = groupsById.get(editImageGroup?.groupId ?? '')?.fullSlug ?? '';
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
  }, [absoluteSlug, editImageGroup, editMode, groupsById, pathsOptions]);

  return {
    editId: editImageGroup?.groupId || null,
    absoluteSlug,
    possibleParents,
    slug,
    title,
    isFavourite,
    canConfirm,
    canMove,
    slugIsInUse,
    slugWasChanged,
    parentSlug,
    selectionCount,
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
    setIsFavourite,
    setParentSlug,
    confirm: async () => {
      cancelEditImageGroup();

      if (!canConfirm || !editImageGroup) {
        return;
      }

      const parentGroupId = groupsByFullSlug.get(parentSlug)?.id ?? '';

      let updateGroup: SerializableImageGroup;

      if (editImageGroup.groupId === NEW_GROUP) {
        if (!editImageGroup.newGroupCover) {
          return;
        }

        updateGroup = {
          id: randomId(),
          slug,
          title,
          isFavourite,
          created: toCreationDate(),
          coverImage: editImageGroup.newGroupCover,
          images: selection,
          groups: [],
          tags: [],
        };
      } else {
        if (!initialValues.imageGroup) {
          return;
        }

        updateGroup = {
          id: initialValues.imageGroup.id,
          created: initialValues.imageGroup.created,
          coverImage: initialValues.imageGroup.coverImage,
          groups: initialValues.imageGroup.groups,
          images: initialValues.imageGroup.images,
          tags: [],
          slug,
          title,
          isFavourite,
        };
      }

      await updateImageGroup(updateGroup, parentGroupId);
      const replaceHistory = editImageGroup.groupId !== NEW_GROUP;
      await navigateToGroup(updateGroup.id, 0, replaceHistory);
    },
    move: async () => {
      cancelEditImageGroup();

      if (!canMove) {
        return;
      }

      const parentGroupId = groupsByFullSlug.get(parentSlug)?.id ?? '';

      // move images to other group or root if no parentgroup
      await moveImagesToGroup(selection, parentGroupId || undefined);
      await navigateToImage(selection[0], true);
    },
    cancelEditImageGroup,
  };
};

export default useEditImageGroup;
