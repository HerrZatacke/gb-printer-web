import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import React from 'react';

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
        onClick={setActive}
        title={t('setActive')}
      >
        <ListItemIcon>
          <CheckCircleIcon />
        </ListItemIcon>
        <ListItemText>
          {t('setActive')}
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={clonePalette}
        title={t('clone')}
      >
        <ListItemIcon>
          <FileCopyIcon />
        </ListItemIcon>
        <ListItemText>
          {t('clone')}
        </ListItemText>
      </MenuItem>
      {!isPredefined && (
        <MenuItem
          onClick={editPalette}
          title={t('edit')}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>
            {t('edit')}
          </ListItemText>
        </MenuItem>
      )}
      {!isPredefined && (
        <MenuItem
          onClick={deletePalette}
          title={t('delete')}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>
            {t('delete')}
          </ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}

export default PaletteContextMenu;
