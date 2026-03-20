import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { type ComponentType, type MouseEventHandler, useMemo } from 'react';
import GalleryGridItemContextMenu from '@/components/GalleryGridItemContextMenu';

interface ContextMenuItem {
  label: string;
  Icon: ComponentType;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

interface Props {
  deleteFrame: () => void,
  editFrame: () => void,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
}


function FrameContextMenu({ deleteFrame, editFrame, menuAnchor, onClose }: Props) {
  const menuItems = useMemo((): ContextMenuItem[] => (
    [
      {
        Icon: EditIcon,
        label: 'edit',
        onClick: () => {
          editFrame();
          onClose();
        },
      },
      {
        Icon: DeleteIcon,
        label: 'delete',
        onClick: () => {
          deleteFrame();
          onClose();
        },
      },
    ]
  ), [deleteFrame, editFrame, onClose]);

  if (!menuAnchor) {
    return null;
  }

  return (
    <GalleryGridItemContextMenu
      menuItems={menuItems}
      menuAnchor={menuAnchor}
      onClose={onClose}
      translationKey="FrameContextMenu"
    />
  );
}

export default FrameContextMenu;
