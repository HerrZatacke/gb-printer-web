import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CodeIcon from '@mui/icons-material/Code';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import ExtensionIcon from '@mui/icons-material/Extension';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PreviewIcon from '@mui/icons-material/Preview';
import ShareIcon from '@mui/icons-material/Share';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PluginSelect from '../PluginSelect';
import { useGalleryImageContext } from './useGalleryImageContext';
import { useImageGroups } from '../../../hooks/useImageGroups';
import { ImageSelectionMode } from '../../stores/filtersStore';
import useSettingsStore from '../../stores/settingsStore';

dayjs.extend(customParseFormat);

interface Props {
  hash: string,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
}

function GalleryImageContextMenu({ hash, menuAnchor, onClose }: Props) {
  const [pluginAnchor, setPluginAnchor] = useState<HTMLElement | null>(null);

  const { enableImageGroups } = useSettingsStore();

  const {
    canShare,
    isSelected,
    hasPlugins,
    isFavourite,
    hasMeta,
    deleteImage,
    setLightboxImage,
    shareImage,
    startDownload,
    showMetadata,
    updateImageToSelection,
    updateFavouriteTag,
    editImage,
  } = useGalleryImageContext(hash);

  const { createGroup } = useImageGroups();

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
        onClick={() => updateImageToSelection(isSelected ? ImageSelectionMode.REMOVE : ImageSelectionMode.ADD)}
        title={isSelected ? 'Remove from selection' : 'Add to selection'}
      >
        <ListItemIcon>
          { isSelected ? <CheckBoxOutlineBlankIcon /> : <CheckBoxIcon />}
        </ListItemIcon>
        <ListItemText>
          {isSelected ? 'Remove from selection' : 'Add to selection'}
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={editImage}
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
        onClick={startDownload}
        title="Download"
      >
        <ListItemIcon>
          <DownloadIcon />
        </ListItemIcon>
        <ListItemText>
          Download
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={deleteImage}
        title="Delete"
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText>
          Delete
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={setLightboxImage}
        title="View in Lightbox"
      >
        <ListItemIcon>
          <PreviewIcon />
        </ListItemIcon>
        <ListItemText>
          View in Lightbox
        </ListItemText>
      </MenuItem>
      {hasPlugins ? (
        <>
          <PluginSelect
            pluginAnchor={pluginAnchor}
            hash={hash}
            onClose={() => setPluginAnchor(null)}
          />
          <MenuItem
            onClick={(ev) => {
              setPluginAnchor(ev.target as HTMLElement);
            }}
            title="Use Plugin"
          >
            <ListItemIcon>
              <ExtensionIcon />
            </ListItemIcon>
            <ListItemText>
              Use Plugin
            </ListItemText>
          </MenuItem>
        </>
      ) : null}
      {canShare ? (
        <MenuItem
          onClick={shareImage}
          title="Share"
        >
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText>
            Share
          </ListItemText>
        </MenuItem>
      ) : null}
      <MenuItem
        onClick={() => updateFavouriteTag(!isFavourite)}
        title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
      >
        <ListItemIcon>
          {isFavourite ? <FavoriteBorderIcon /> : <FavoriteIcon />}
        </ListItemIcon>
        <ListItemText>
          {isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        </ListItemText>
      </MenuItem>
      {(hasMeta) && (
        <MenuItem
          onClick={showMetadata}
          title="Show Metadata"
        >
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText>
            Show Metadata
          </ListItemText>
        </MenuItem>
      )}
      {(isSelected && enableImageGroups) && (
        <MenuItem
          onClick={() => createGroup(hash)}
          title="Create Group"
        >
          <ListItemIcon>
            <CreateNewFolderIcon />
          </ListItemIcon>
          <ListItemText>
            Create Group
          </ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}

export default GalleryImageContextMenu;
