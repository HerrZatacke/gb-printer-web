import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useImageGroups } from '@/hooks/useImageGroups';

interface Props {
  groupId: string,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
}

function GalleryGroupContextMenu({ groupId, menuAnchor, onClose }: Props) {
  const t = useTranslations('GalleryGroupContextMenu');
  const { deleteGroup, editGroup } = useImageGroups();

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
      <MenuItem
        onClick={() => editGroup(groupId)}
        title={t('edit')}
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText>
          {t('edit')}
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => deleteGroup(groupId)}
        title={t('delete')}
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText>
          {t('delete')}
        </ListItemText>
      </MenuItem>
    </Menu>
  );
}

export default GalleryGroupContextMenu;
