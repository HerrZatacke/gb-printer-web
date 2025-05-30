import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';

interface Props {
  deleteFrame: () => void,
  editFrame: () => void,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
}


function GalleryGroupContextMenu({ deleteFrame, editFrame, menuAnchor, onClose }: Props) {
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
        onClick={deleteFrame}
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
