import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  deleteFrame: () => void,
  editFrame: () => void,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
}


function GalleryGroupContextMenu({ deleteFrame, editFrame, menuAnchor, onClose }: Props) {
  const t = useTranslations('FrameContextMenu');
  
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
        onClick={editFrame}
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
        onClick={deleteFrame}
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
