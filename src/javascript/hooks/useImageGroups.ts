import { useMemo } from 'react';
import { longestCommonSubstring } from 'string-algorithms';
import useDialogsStore from '../app/stores/dialogsStore';
import { DialoqQuestionType } from '../../types/Dialog';
import { useGalleryTreeContext } from '../app/contexts/galleryTree';
import { NEW_GROUP } from '../app/components/Overlays/EditImageGroup/useEditImageGroup';
import useEditStore from '../app/stores/editStore';
import useItemsStore from '../app/stores/itemsStore';
import useFiltersStore from '../app/stores/filtersStore';


interface UseImageGroups {
  resetGroups: () => void,
  createGroup: (hash: string) => void,
  editGroup: (id: string) => void,
  deleteGroup: (id: string) => void,
}

export const useImageGroups = (): UseImageGroups => {
  const { view } = useGalleryTreeContext();
  const { dismissDialog, setDialog } = useDialogsStore();
  const { setEditImageGroup } = useEditStore();
  const { deleteImageGroup, setImageGroups, images } = useItemsStore();
  const { imageSelection } = useFiltersStore();

  const newGroupTitle = useMemo<string>(() => {
    if (!imageSelection.length) {
      return '';
    }

    const titles = images
      .filter(({ hash }) => imageSelection.includes(hash))
      .map(({ title }) => title)
      .filter((title) => title.length > 3);

    const groupTitle = longestCommonSubstring(titles);

    const rawTitle = groupTitle.filter((part) => (part.length > 3))[0]?.trim();

    if (!rawTitle) {
      return 'New Group';
    }

    return rawTitle
      .replace(/[_-]/g, ' ')
      .replace(/^\s*\d+\s+|\s+\d+\s*$/g, '')
      .trim();
  }, [imageSelection, images]);

  return {
    resetGroups: () => {
      setDialog({
        message: 'Reset image groups?',
        questions: () => [{
          key: 'info',
          type: DialoqQuestionType.INFO,
          label: 'This will remove ALL your created groups and all existing images will be moved to the top level.',
        }],
        confirm: async () => {
          dismissDialog(0);
          setImageGroups([]);
        },
        deny: async () => {
          dismissDialog(0);
        },
      });
    },
    createGroup: (hash: string) => {
      setEditImageGroup({
        groupId: NEW_GROUP,
        newGroupCover: hash,
        newGroupTitle,
      });
    },
    editGroup: (id: string) => {
      setEditImageGroup({ groupId: id });
    },
    deleteGroup: (id: string) => {
      const deleteGroup = view.groups.find((group) => group.id === id);
      if (!deleteGroup) {
        return;
      }

      setDialog({
        message: 'Delete image group?',
        questions: () => [{
          key: 'info',
          type: DialoqQuestionType.INFO,
          label: `This will delete this group "${deleteGroup.title || deleteGroup.slug}" and move all children (images & groups) to the current level.`,
        }],
        confirm: async () => {
          dismissDialog(0);
          deleteImageGroup(id);
        },
        deny: async () => {
          dismissDialog(0);
        },
      });
    },
  };
};
