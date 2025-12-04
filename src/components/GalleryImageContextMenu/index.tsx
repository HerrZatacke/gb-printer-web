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
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PreviewIcon from '@mui/icons-material/Preview';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import PluginSelect from '@/components/PluginSelect';
import { useGalleryImageContext } from '@/hooks/useGalleryImageContext';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useSuperPrinterInterface } from '@/hooks/useSuperPrinterInterface';
import { ImageSelectionMode } from '@/stores/filtersStore';

interface Props {
  hash: string,
  menuAnchor: HTMLElement | null,
  onClose: () => void,
}

function GalleryImageContextMenu({ hash, menuAnchor, onClose }: Props) {
  const t = useTranslations('GalleryImageContextMenu');
  const [pluginAnchor, setPluginAnchor] = useState<HTMLElement | null>(null);

  const {
    canShare,
    isSelected,
    hasPlugins,
    isFavourite,
    hasMeta,
    hasHashes,
    deleteImage,
    setLightboxImage,
    shareImage,
    playImage,
    startDownload,
    showMetadata,
    updateImageToSelection,
    updateFavouriteTag,
    editImage,
  } = useGalleryImageContext(hash);

  const {
    canPrint,
    print,
  } = useSuperPrinterInterface();

  const { createGroup } = useImageGroups();

  if (!menuAnchor) {
    return null;
  }

  return (
    <>
      <Menu
        open={!!menuAnchor}
        anchorEl={menuAnchor}
        onClose={onClose}
        onClick={(ev) => {
          ev.stopPropagation();
        }}
      >
        <MenuItem
          onClick={() => {
            editImage();
            onClose();
          }}
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
          onClick={() => {
            startDownload();
            onClose();
          }}
          title={t('download')}
        >
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText>
            {t('download')}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteImage();
            onClose();
          }}
          title={t('delete')}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>
            {t('delete')}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setLightboxImage();
            onClose();
          }}
          title={t('viewInLightbox')}
        >
          <ListItemIcon>
            <PreviewIcon />
          </ListItemIcon>
          <ListItemText>
            {t('viewInLightbox')}
          </ListItemText>
        </MenuItem>
        {canPrint && (
          <MenuItem
            onClick={() => {
              print(hash);
              onClose();
            }}
            title={t('printViaSuperPrinter')}
          >
            <ListItemIcon>
              <PrintIcon />
            </ListItemIcon>
            <ListItemText>
              {t('printViaSuperPrinter')}
            </ListItemText>
          </MenuItem>
        )}
        {hasPlugins ? (
          <MenuItem
            onClick={(ev) => {
              setPluginAnchor(ev.target as HTMLElement);
            }}
            title={t('usePlugin')}
          >
            <ListItemIcon>
              <ExtensionIcon />
            </ListItemIcon>
            <ListItemText>
              {t('usePlugin')}
            </ListItemText>
          </MenuItem>
        ) : null}
        {canShare ? (
          <MenuItem
            onClick={() => {
              shareImage();
              onClose();
            }}
            title={t('share')}
          >
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText>
              {t('share')}
            </ListItemText>
          </MenuItem>
        ) : null}
        <MenuItem
          onClick={() => {
            playImage();
            onClose();
          }}
          title={t('play')}
        >
          <ListItemIcon>
            <MusicNoteIcon />
          </ListItemIcon>
          <ListItemText>
            {t('play')}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            updateFavouriteTag(!isFavourite);
            onClose();
          }}
          title={isFavourite ? t('removeFromFavourites') : t('addToFavourites')}
        >
          <ListItemIcon>
            {isFavourite ? <FavoriteBorderIcon /> : <FavoriteIcon />}
          </ListItemIcon>
          <ListItemText>
            {isFavourite ? t('removeFromFavourites') : t('addToFavourites')}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            updateImageToSelection(isSelected ? ImageSelectionMode.REMOVE : ImageSelectionMode.ADD);
            onClose();
          }}
          title={isSelected ? t('removeFromSelection') : t('addToSelection')}
        >
          <ListItemIcon>
            { isSelected ? <CheckBoxOutlineBlankIcon /> : <CheckBoxIcon />}
          </ListItemIcon>
          <ListItemText>
            {isSelected ? t('removeFromSelection') : t('addToSelection')}
          </ListItemText>
        </MenuItem>
        {(hasMeta || hasHashes) && (
          <MenuItem
            onClick={() => {
              showMetadata();
              onClose();
            }}
            title={t('showMetadata')}
          >
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText>
              {t('showMetadata')}
            </ListItemText>
          </MenuItem>
        )}
        {isSelected && (
          <MenuItem
            onClick={() => {
              createGroup(hash);
              onClose();
            }}
            title={t('createGroup')}
          >
            <ListItemIcon>
              <CreateNewFolderIcon />
            </ListItemIcon>
            <ListItemText>
              {t('createGroup')}
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
      <PluginSelect
        pluginAnchor={pluginAnchor}
        hash={hash}
        onClose={() => {
          setPluginAnchor(null);
          onClose();
        }}
      />
    </>
  );
}

export default GalleryImageContextMenu;
