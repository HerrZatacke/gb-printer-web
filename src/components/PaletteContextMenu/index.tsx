import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import React, { type ComponentType, type MouseEventHandler, useMemo } from 'react';

interface ContextMenuItem {
  label: string;
  Icon: ComponentType;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

interface Props {
  isPredefined: boolean,
  clonePalette: () => void,
  editPalette: () => void,
  deletePalette: () => void,
  setActive: () => void,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
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
  const t = useTranslations('PaletteContextMenu');

  const menuItems = useMemo((): ContextMenuItem[] => (
    [
      {
        Icon: CheckCircleIcon,
        label: 'setActive',
        onClick: setActive,
      },
      {
        Icon: FileCopyIcon,
        label: 'clone',
        onClick: clonePalette,
      },
      {
        Icon: EditIcon,
        label: 'edit',
        disabled: isPredefined,
        onClick: editPalette,
      },
      {
        Icon: DeleteIcon,
        label: 'delete',
        disabled: isPredefined,
        onClick: deletePalette,
      },
    ]
  ), [clonePalette, deletePalette, editPalette, isPredefined, setActive]);

  if (!menuAnchor) {
    return null;
  }

  return (
    <Menu
      open={!!menuAnchor}
      anchorEl={menuAnchor}
      onClose={onClose}
      onClick={(ev) => {
        ev.stopPropagation();
        onClose();
      }}
    >
      {menuItems.map(({ label, Icon, disabled, onClick }) => (
        <MenuItem
          key={label}
          onClick={onClick}
          title={t(label)}
          disabled={disabled}
        >
          <ListItemIcon><Icon /></ListItemIcon>
          <ListItemText>{t(label)}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
}

export default PaletteContextMenu;
