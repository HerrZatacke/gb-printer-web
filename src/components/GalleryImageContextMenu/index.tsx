import AudiotrackIcon from '@mui/icons-material/Audiotrack';
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
import Bowser from 'bowser';
import { type ComponentType, type MouseEventHandler, useMemo, useState } from 'react';
import GalleryGridItemContextMenu from '@/components/GalleryGridItemContextMenu';
import PluginSelect from '@/components/PluginSelect';
import { useGalleryImageContext } from '@/hooks/useGalleryImageContext';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useSuperPrinterInterface } from '@/hooks/useSuperPrinterInterface';
import { ImageSelectionMode, useInteractionsStore } from '@/stores/stores';

const browser = Bowser.getParser(typeof window !== 'undefined' ? window.navigator.userAgent : '.');

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

  const {
    setSSTVHash,
  } = useInteractionsStore();

  const { createGroup } = useImageGroups();
  const sstvEnabled = browser.getBrowserName() !== 'Firefox';

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
        Icon: AudiotrackIcon,
        label: 'useSSTV',
        disabled: !sstvEnabled,
        onClick: () => {
          setSSTVHash(hash);
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
    setSSTVHash,
    shareImage,
    showMetadata,
    sstvEnabled,
    startDownload,
    updateFavouriteTag,
    updateImageToSelection,
  ]);

  if (!menuAnchor) {
    return null;
  }

  return (
    <>
      <GalleryGridItemContextMenu
        menuItems={menuItems}
        menuAnchor={menuAnchor}
        onClose={onClose}
        translationKey="GalleryImageContextMenu"
      />
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
