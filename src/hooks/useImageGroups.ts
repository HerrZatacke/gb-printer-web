import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { longestCommonSubstring } from 'string-algorithms';
import { DialoqQuestionType } from '@/consts/dialog';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { NEW_GROUP } from '@/hooks/useEditImageGroup';
import useDialogsStore from '@/stores/dialogsStore';
import useEditStore from '@/stores/editStore';
import useFiltersStore from '@/stores/filtersStore';
import useItemsStore from '@/stores/itemsStore';

interface UseImageGroups {
  resetGroups: () => void,
  createGroup: (hash: string) => void,
  editGroup: (id: string) => void,
  deleteGroup: (id: string) => void,
}

export const useImageGroups = (): UseImageGroups => {
  const t = useTranslations('useImageGroups');
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
      return t('newGroupDefault');
    }

    return rawTitle
      .replace(/[_-]/g, ' ')
      .replace(/^\s*\d+\s+|\s+\d+\s*$/g, '')
      .trim();
  }, [imageSelection, images, t]);

  return {
    resetGroups: () => {
      setDialog({
        message: t('resetGroupsMessage'),
        questions: () => [{
          key: 'info',
          type: DialoqQuestionType.INFO,
          label: t('resetGroupsInfo'),
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
        message: t('deleteGroupMessage'),
        questions: () => [{
          key: 'info',
          type: DialoqQuestionType.INFO,
          label: t('deleteGroupInfo', { groupTitle: deleteGroup.title || deleteGroup.slug }),
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
