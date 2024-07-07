import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Actions } from '../../../store/actions';
import { randomId } from '../../../../tools/randomId';
import { dateFormat } from '../../../defaults';
import { useGalleryTreeContext } from '../../../contexts/galleryTree';
import { useGalleryParams } from '../../../../hooks/useGalleryParams';
import type { State } from '../../../store/State';
import type { CancelEditImageGroupAction, AddImageGroupAction, UpdateImageGroupAction } from '../../../../../types/actions/GroupActions';
import type { DialogOption } from '../../../../../types/Dialog';
import type { PathMap } from '../../../contexts/galleryTree';

export const NEW_GROUP = 'NEW_GROUP';

interface UseEditImageGroup {
  editId: string | null,
  absoluteSlug: string,
  possibleParents: DialogOption[],
  slug: string,
  title: string,
  canConfirm: boolean,
  parentSlug: string,
  setSlug: (slug: string) => void,
  setTitle: (title: string) => void,
  setParentSlug: (slug: string) => void
  confirm: () => void,
  cancelEdit: () => void,
}

const toSlug = (title: string): string => (
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
  const {
    imageGroup,
    editImageGroup,
    selection,
  } = useSelector((state: State) => ({
    imageGroup: state.imageGroups.find(({ id }) => id === state.editImageGroup?.groupId) || null,
    editImageGroup: state.editImageGroup,
    selection: state.imageSelection,
  }));

  const { view, paths, pathsOptions } = useGalleryTreeContext();
  const { path: currentPath } = useGalleryParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const canConfirm = !(
    slug.length === 0 || // no slug entered
    (
      slug !== imageGroup?.slug && // slug has changed
      paths.find(({ absolutePath }) => absolutePath === absoluteSlug) // absolute slug already exists
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
      if (!canConfirm) {
        return;
      }

      if (editImageGroup?.groupId === NEW_GROUP) {
        if (!editImageGroup?.newGroupCover) {
          return;
        }

        dispatch<AddImageGroupAction>({
          type: Actions.ADD_IMAGE_GROUP,
          payload: {
            parentId: view.id,
            group: {
              id: randomId(),
              slug,
              title,
              created: dayjs(Date.now()).format(dateFormat),
              coverImage: editImageGroup?.newGroupCover,
              images: selection,
              groups: [],
            },
          },
        });
      } else {
        if (!imageGroup) {
          return;
        }

        const parentGroupId = paths.find(({ absolutePath }) => absolutePath === parentSlug)?.group.id || '';

        dispatch<UpdateImageGroupAction>({
          type: Actions.UPDATE_IMAGE_GROUP,
          payload: {
            group: {
              ...imageGroup,
              slug,
              title,
            },
            parentGroupId,
          },
        });
      }

      navigate(`/gallery/${parentSlug}${slug}/page/1`);
    },
    cancelEdit: () => {
      dispatch<CancelEditImageGroupAction>({
        type: Actions.CANCEL_EDIT_IMAGE_GROUP,
      });
    },
  };
};

export default useEditImageGroup;
