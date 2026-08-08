import { useQueryClient } from '@tanstack/react-query';
import { toCreationDate } from 'gb-printer-schemas';
import { useEffect, useMemo, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useImageGroups } from '@/hooks/useImageGroups';
import { imageGroupsListQueryOptions } from '@/stores/items/queries/imageGroups';
import {
  type EditGroupInfo,
  useEditStore,
  useFiltersStore,
} from '@/stores/stores';
import { cleanFullSlug } from '@/tools/cleanSlug';
import { randomId } from '@/tools/randomId';
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
  canEdit: boolean;
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
  const queryClient = useQueryClient();
  const { updateImageGroup, moveImagesToGroup } = useImageGroups({});
  const { navigateToGroup, navigateToImage } = useNavigationTools();
  const { path: currentPath, view, groupsByFullSlug, groupsById, pathsOptions } = useGalleryTreeContext();
  const selectionCount = selection.length;

  const editMode = getEditMode(editImageGroup);

  const [initialValues, setInitialValues] = useState<InitialEditValues | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [slug, setSlug] = useState<string>('');
  const [slugTouched, setSlugTouched] = useState<boolean>(false);
  const [parentSlug, setParentSlug] = useState<string>('');

  useEffect(() => {
    const prepareInitialValues = async (): Promise<InitialEditValues> => {
      switch (editMode) {
        case EditMode.CREATE_NEW: {
          const newTitle = editImageGroup?.newGroupTitle || '';
          return {
            imageGroup: null,
            parentGroup: view ? groupsById.get(view.id) ?? null : null,
            title: newTitle,
            isFavourite: false,
            slug: toSlug(newTitle),
            slugTouched: false,
          };
        }

        case EditMode.EDIT_EXISTING: {
          const { items: freshGroups } = await queryClient.fetchQuery({
            ...imageGroupsListQueryOptions(),
            staleTime: 0,
          });

          const imageGroup = freshGroups.find(({ id }) => id === editImageGroup?.groupId) || null;

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
    };

    prepareInitialValues()
      .then((initial) => {
        setInitialValues(initial);
        setTitle(initial.title);
        setIsFavourite(initial.isFavourite);
        setSlug(initial.slug);
        setSlugTouched(initial.slugTouched);
        setParentSlug(initial.parentGroup?.fullSlug || '');
      });

    return () => setInitialValues(null);
  }, [editImageGroup, editMode, queryClient, groupsById, view]);

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
  const slugWasChanged = useMemo<boolean>(() => (
    Boolean(initialValues && (slug !== initialValues.imageGroup?.slug))
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
    if (!initialValues) {
      return false;
    }

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
    canEdit: Boolean(initialValues),
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

      if (!canConfirm || !editImageGroup || !initialValues) {
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
      setTimeout(async () => {
        await navigateToImage(selection[0], true);
      }, 1000);
    },
    cancelEditImageGroup,
  };
};

export default useEditImageGroup;
