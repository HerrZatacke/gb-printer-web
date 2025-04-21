import React, { useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import SyncIcon from '@mui/icons-material/Sync';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import UsbIcon from '@mui/icons-material/Usb';
import { NavLink, useLocation } from 'react-router';
import { alpha } from '@mui/material';
import useNavigation from './useNavigation';
import { useGalleryParams } from '../../../hooks/useGalleryParams';
import useInteractionsStore from '../../stores/interactionsStore';
import { reduceItems } from '../../../tools/reduceArray';
import useSettingsStore from '../../stores/settingsStore';
import { ThemeName } from '../../../consts/theme';
import { lightTheme } from '../../../styles/themes';

interface NavItem {
  label: string,
  route: string,
}

interface NavActionItem {
  title: string,
  icon: React.ReactNode,
  badgeContent: string | null,
  onClick: () => void,
}

const drawerContainer = document.body;

function Navigation() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { lastGalleryLink } = useGalleryParams();
  const { pathname } = useLocation();
  const { themeName, setThemeName } = useSettingsStore();

  const {
    disableSerials,
    syncBusy,
    useSync,
    useSerials,
    syncLastUpdate,
    autoDropboxSync,
    selectSync,
    setShowSerials,
  } = useNavigation();

  const {
    showTrashCount,
    trashCount,
  } = useInteractionsStore();

  const trashCountSum = useMemo(() => (trashCount.frames + trashCount.images), [trashCount]);

  const syncNotification = useMemo(() => (
    autoDropboxSync && (syncLastUpdate.local !== syncLastUpdate.dropbox)
  ), [autoDropboxSync, syncLastUpdate]);

  const syncTitle = useMemo(() => (
    (syncLastUpdate.local > syncLastUpdate.dropbox) ?
      'There are local changes not synched to dropbox yet' :
      'There are remote changes not synched yet'
  ), [syncLastUpdate]);

  const navItems = useMemo<NavItem[]>(() => (
    [
      {
        label: 'Home',
        route: '/home',
      },
      {
        label: 'Gallery',
        route: lastGalleryLink && pathname !== lastGalleryLink ? lastGalleryLink : '/gallery/page/1',
      },
      {
        label: 'Import',
        route: '/import',
      },
      {
        label: 'Palettes',
        route: '/palettes',
      },
      {
        label: 'Frames',
        route: '/frames',
      },
      {
        label: 'Settings',
        route: '/settings',
      },
    ].reduce(reduceItems<NavItem>, [])
  ), [lastGalleryLink, pathname]);

  const navActionItems = useMemo<NavActionItem[]>(() => (
    [
      {
        title: 'Trash',
        icon: <DeleteIcon />,
        badgeContent: trashCountSum > 0 ? trashCountSum.toString(10) : null,
        disabled: false,
        onClick: () => showTrashCount(true),
      },
      useSync ? {
        title: syncTitle,
        icon: <SyncIcon />,
        badgeContent: syncNotification ? '!' : null,
        disabled: syncBusy,
        onClick: selectSync,
      } : null,
      {
        title: themeName === ThemeName.BRIGHT ? 'Switch to dark mode' : 'Switch to bright mode',
        icon: themeName === ThemeName.BRIGHT ? <LightModeIcon /> : <DarkModeIcon />,
        badgeContent: null,
        disabled: false,
        onClick: () => setThemeName(themeName === ThemeName.BRIGHT ? ThemeName.DARK : ThemeName.BRIGHT),
      },
      useSerials ? {
        title: disableSerials ? 'USB devices are disabled' : 'WebUSB Serial devices',
        icon: <UsbIcon />,
        badgeContent: null,
        disabled: disableSerials,
        onClick: setShowSerials,
      } : null,
    ].reduce(reduceItems<NavActionItem>, [])
  ), [
    disableSerials,
    selectSync,
    setShowSerials,
    setThemeName,
    showTrashCount,
    syncBusy,
    syncNotification,
    syncTitle,
    themeName,
    trashCountSum,
    useSerials,
    useSync,
  ]);

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <AppBar color="primary" enableColorOnDark position="sticky">
          <Container maxWidth="xl" disableGutters>
            <Toolbar disableGutters>
              <ButtonGroup
                variant="text"
                component="nav"
                role="navigation"
                aria-label="Main Navigation"
                sx={{ display: { xs: 'none', md: 'inline-flex' }, width: '100%' }}
              >
                {navItems.map(({ route, label }) => (
                  <Button
                    key={route}
                    to={route}
                    component={NavLink}
                    color="inherit"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>

              <ButtonGroup
                variant="text"
                role="navigation"
                aria-label="Utility Navigation"
              >
                {navActionItems.map(({ title, icon, onClick, badgeContent }) => (
                  <IconButton
                    key={title}
                    color="inherit"
                    title={title}
                    onClick={onClick}
                  >
                    <Badge
                      badgeContent={badgeContent}
                      color="error"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      {icon}
                    </Badge>
                  </IconButton>
                ))}
                <IconButton
                  color="inherit"
                  title="Open Main Navigation"
                  onClick={() => setMobileNavOpen(true)}
                  sx={{ display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
              </ButtonGroup>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
      <Drawer
        container={drawerContainer}
        variant="temporary"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={(theme) => ({
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: { xs: '100%', sm: theme.breakpoints.values.sm } },
        })}
      >
        <Toolbar disableGutters>
          <ButtonGroup
            variant="text"
            sx={{ display: { md: 'none' } }}
          >
            <IconButton
              color="inherit"
              title="Close Main Navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </ButtonGroup>
        </Toolbar>
        <Divider />
        <List>
          {navItems.map(({ route, label }) => (
            <ListItem key={route} disablePadding>
              <ListItemButton
                to={route}
                component={NavLink}
                onClick={() => setMobileNavOpen(false)}
                sx={(theme) => ({
                  '&.active': {
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.contrastText,
                  },
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.3),
                  },
                })}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navigation;
