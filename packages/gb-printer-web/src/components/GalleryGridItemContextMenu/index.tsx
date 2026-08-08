import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import { type ComponentType, type MouseEventHandler } from 'react';

interface ContextMenuItem {
  label: string;
  Icon: ComponentType;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

interface Props {
  menuItems: ContextMenuItem[];
  menuAnchor: HTMLElement | null;
  onClose: () => void;
  translationKey: string;
}

function GalleryGridItemContextMenu({ menuAnchor, onClose, menuItems, translationKey }: Props) {
  const t = useTranslations(translationKey);

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
  );
}

export default GalleryGridItemContextMenu;
