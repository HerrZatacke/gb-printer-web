import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import React, { type ComponentType, type MouseEventHandler, useMemo } from 'react';
import { useImageGroups } from '@/hooks/useImageGroups';

interface ContextMenuItem {
  label: string;
  Icon: ComponentType;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

interface Props {
  groupId: string,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
}

function GalleryGroupContextMenu({ groupId, menuAnchor, onClose }: Props) {
  const t = useTranslations('GalleryGroupContextMenu');
  const { deleteGroup, editGroup } = useImageGroups();

  const menuItems = useMemo((): ContextMenuItem[] => (
    [
      {
        Icon: EditIcon,
        label: 'edit',
        onClick: () => editGroup(groupId),
      },
      {
        Icon: DeleteIcon,
        label: 'delete',
        onClick: () => deleteGroup(groupId),
      },
    ]
  ), [deleteGroup, editGroup, groupId]);

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

export default GalleryGroupContextMenu;
