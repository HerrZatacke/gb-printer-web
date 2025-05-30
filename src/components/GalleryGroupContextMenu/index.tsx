import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useImageGroups } from '../../../hooks/useImageGroups';

interface Props {
  groupId: string,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
}

function GalleryGroupContextMenu({ groupId, menuAnchor, onClose }: Props) {
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
        title="Edit"
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText>
          Edit
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => deleteGroup(groupId)}
        title="Delete"
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText>
          Delete
        </ListItemText>
      </MenuItem>
    </Menu>
  );
}

export default GalleryGroupContextMenu;
