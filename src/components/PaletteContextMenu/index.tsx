import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
        title="Set Active"
      >
        <ListItemIcon>
          <CheckCircleIcon />
        </ListItemIcon>
        <ListItemText>
          Set Active
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={clonePalette}
        title="Clone"
      >
        <ListItemIcon>
          <FileCopyIcon />
        </ListItemIcon>
        <ListItemText>
          Clone
        </ListItemText>
      </MenuItem>
      {!isPredefined && (
        <MenuItem
          onClick={editPalette}
          title="Edit"
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>
            Edit
          </ListItemText>
        </MenuItem>
      )}
      {!isPredefined && (
        <MenuItem
          onClick={deletePalette}
          title="Delete"
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>
            Delete
          </ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}

export default PaletteContextMenu;
