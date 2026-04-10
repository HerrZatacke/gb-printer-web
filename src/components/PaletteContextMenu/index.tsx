import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import React, { type ComponentType, type MouseEventHandler, useMemo } from 'react';
import GalleryGridItemContextMenu from '@/components/GalleryGridItemContextMenu';

interface ContextMenuItem {
  label: string;
  Icon: ComponentType;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

interface Props {
  isPredefined: boolean;
  clonePalette: () => void;
  editPalette: () => void;
  deletePalette: () => void;
  setActive: () => void;
  menuAnchor: HTMLElement | null;
  onClose: () => void;
}

function PaletteContextMenu({
  isPredefined,
  clonePalette,
  editPalette,
  deletePalette,
  setActive,
  menuAnchor,
  onClose,
}: Props) {
  const menuItems = useMemo((): ContextMenuItem[] => (
    [
      {
        Icon: CheckCircleIcon,
        label: 'setActive',
        onClick: () => {
          setActive();
          onClose();
        },
      },
      {
        Icon: FileCopyIcon,
        label: 'clone',
        onClick: () => {
          clonePalette();
          onClose();
        },
      },
      {
        Icon: EditIcon,
        label: 'edit',
        disabled: isPredefined,
        onClick: () => {
          editPalette();
          onClose();
        },
      },
      {
        Icon: DeleteIcon,
        label: 'delete',
        disabled: isPredefined,
        onClick: () => {
          deletePalette();
          onClose();
        },
      },
    ]
  ), [clonePalette, deletePalette, editPalette, isPredefined, onClose, setActive]);

  if (!menuAnchor) {
    return null;
  }

  return (
    <GalleryGridItemContextMenu
      menuItems={menuItems}
      menuAnchor={menuAnchor}
      onClose={onClose}
      translationKey="PaletteContextMenu"
    />
  );
}

export default PaletteContextMenu;
