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
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import { type ComponentType, type MouseEventHandler, useMemo, useState } from 'react';
import PluginSelect from '@/components/PluginSelect';
import { useGalleryImageContext } from '@/hooks/useGalleryImageContext';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useSuperPrinterInterface } from '@/hooks/useSuperPrinterInterface';
import { ImageSelectionMode } from '@/stores/stores';

interface ContextMenuItem {
  label: string;
  Icon: ComponentType;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

interface Props {
  hash: string;
  menuAnchor: HTMLElement | null;
  onClose: () => void;
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

  const menuItems = useMemo((): ContextMenuItem[] => (
    [
      {
        Icon: EditIcon,
        label: 'edit',
        onClick: () => {
          editImage();
          onClose();
        },
      },
      {
        Icon: DownloadIcon,
        label: 'download',
        onClick: () => {
          startDownload();
          onClose();
        },
      },
      {
        Icon: DeleteIcon,
        label: 'delete',
        onClick: () => {
          deleteImage();
          onClose();
        },
      },
      {
        Icon: PreviewIcon,
        label: 'viewInLightbox',
        onClick: () => {
          setLightboxImage();
          onClose();
        },
      },
      {
        Icon: PrintIcon,
        label: 'printViaSuperPrinter',
        disabled: !canPrint,
        onClick: () => {
          print(hash);
          onClose();
        },
      },
      {
        Icon: ExtensionIcon,
        label: 'usePlugin',
        disabled: !hasPlugins,
        onClick: (ev) => {
          setPluginAnchor(ev.target as HTMLElement);
        },
      },
      {
        Icon: ShareIcon,
        label: 'share',
        disabled: !canShare,
        onClick: () => {
          shareImage();
          onClose();
        },
      },
      {
        Icon: isFavourite ? FavoriteBorderIcon : FavoriteIcon,
        label: isFavourite ? 'removeFromFavourites' : 'addToFavourites',
        onClick: () => {
          updateFavouriteTag(!isFavourite);
          onClose();
        },
      },
      {
        Icon: isSelected ? CheckBoxOutlineBlankIcon : CheckBoxIcon,
        label: isSelected ? 'removeFromSelection' : 'addToSelection',
        onClick: () => {
          updateImageToSelection(isSelected ? ImageSelectionMode.REMOVE : ImageSelectionMode.ADD);
          onClose();
        },
      },
      {
        Icon: CodeIcon,
        label: 'showMetadata',
        disabled: !(hasMeta || hasHashes),
        onClick: () => {
          showMetadata();
          onClose();
        },
      },
      {
        Icon: CreateNewFolderIcon,
        label: 'createGroup',
        disabled: !isSelected,
        onClick: () => {
          createGroup(hash);
          onClose();
        },
      },
    ]
  ), [
    canPrint,
    canShare,
    createGroup,
    deleteImage,
    editImage,
    hasHashes,
    hasMeta,
    hasPlugins,
    hash,
    isFavourite,
    isSelected,
    onClose,
    print,
    setLightboxImage,
    shareImage,
    showMetadata,
    startDownload,
    updateFavouriteTag,
    updateImageToSelection,
  ]);

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
