import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { type ComponentType, type MouseEventHandler, useMemo } from 'react';
import GalleryGridItemContextMenu from '@/components/GalleryGridItemContextMenu';
import { useImageGroups } from '@/hooks/useImageGroups';

interface ContextMenuItem {
  label: string;
  Icon: ComponentType;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

interface Props {
  groupId: string;
  menuAnchor: HTMLElement | null;
  onClose: () => void;
}

function GalleryGroupContextMenu({ groupId, menuAnchor, onClose }: Props) {
  const { deleteGroup, editGroup } = useImageGroups();

  const menuItems = useMemo((): ContextMenuItem[] => (
    [
      {
        Icon: EditIcon,
        label: 'edit',
        onClick: () => {
          editGroup(groupId);
          onClose();
        },
      },
      {
        Icon: DeleteIcon,
        label: 'delete',
        onClick: () => {
          deleteGroup(groupId);
          onClose();
        },
      },
    ]
  ), [deleteGroup, editGroup, groupId, onClose]);

  if (!menuAnchor) {
    return null;
  }

  return (
    <GalleryGridItemContextMenu
      menuItems={menuItems}
      menuAnchor={menuAnchor}
      onClose={onClose}
      translationKey="GalleryGroupContextMenu"
    />
  );
}

export default GalleryGroupContextMenu;
