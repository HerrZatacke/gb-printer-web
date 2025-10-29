'use client';

import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DeleteIcon from '@mui/icons-material/Delete';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import SyncIcon from '@mui/icons-material/Sync';
import UsbIcon from '@mui/icons-material/Usb';
import { alpha } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import type { Theme } from '@mui/system';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';
import { ThemeName } from '@/consts/theme';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { usePortsContext } from '@/contexts/ports';
import useNavigation from '@/hooks/useNavigation';
import { useUrl } from '@/hooks/useUrl';
import useInteractionsStore from '@/stores/interactionsStore';
import useSettingsStore from '@/stores/settingsStore';
import { lightTheme } from '@/styles/themes';
import { reduceItems } from '@/tools/reduceArray';

enum NavBadgeColor {
  ERROR = 'error',
  INFO = 'info',
  DEFAULT = 'default',
}

interface NavItem {
  label: string,
  route: string,
  prefetch: boolean,
}

interface NavActionItem {
  title: string,
  icon: React.ReactNode,
  badgeContent: string | null,
  badgeColor: NavBadgeColor,
  onClick: () => void,
  disabled: boolean,
  isBusy: boolean,
}

function Navigation() {
  const t = useTranslations('Navigation');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [drawerContainer, setDrawerContainer] = useState<HTMLElement | undefined>(undefined);
  const { fullPath } = useUrl();
  const { themeName, setThemeName } = useSettingsStore();
  const { showTrashCount, trashCount, trashBusy } = useInteractionsStore();
  const { lastGalleryLink, getUrl } = useGalleryTreeContext();
  const [galleryRoute, setGalleryRoute] = useState(getUrl({ pageIndex: 0, group: '' }));

  useEffect(() => {
    // Set "galleryRoute" on client side only to prevent hydration issues
    setGalleryRoute(lastGalleryLink && fullPath !== lastGalleryLink ? lastGalleryLink : getUrl({ pageIndex: 0, group: '' }));
  }, [fullPath, getUrl, lastGalleryLink]);

  useEffect(() => {
    setDrawerContainer(document.body);
  }, []);

  const {
    disableSerials,
    serialWarning,
    portCount,
    syncBusy,
    useSync,
    useSerials,
    syncLastUpdate,
    autoDropboxSync,
    selectSync,
    setShowSerials,
  } = useNavigation();

  const { isReceiving } = usePortsContext();

  const trashCountSum = useMemo(() => (trashCount.frames + trashCount.images), [trashCount]);

  const syncNotification = useMemo(() => (
    autoDropboxSync && (syncLastUpdate.local !== syncLastUpdate.dropbox)
  ), [autoDropboxSync, syncLastUpdate]);

  const navItems = useMemo<NavItem[]>(() => (
    [
      {
        label: t('home'),
        route: '/',
        prefetch: false,
      },
      {
        label: t('gallery'),
        route: galleryRoute,
        prefetch: true,
      },
      {
        label: t('import'),
        route: '/import',
        prefetch: false,
      },
      {
        label: t('palettes'),
        route: '/palettes',
        prefetch: true,
      },
      {
        label: t('frames'),
        route: '/frames',
        prefetch: true,
      },
      {
        label: t('settings'),
        route: '/settings/generic',
        prefetch: false,
      },
    ].reduce(reduceItems<NavItem>, [])
  ), [galleryRoute, t]);

  const navActionItems = useMemo<NavActionItem[]>(() => (
    [
      {
        title: t('trash'),
        icon: <DeleteIcon />,
        badgeContent: trashCountSum > 0 ? trashCountSum.toString(10) : null,
        badgeColor: NavBadgeColor.ERROR,
        disabled: trashBusy,
        isBusy: trashBusy,
        onClick: () => showTrashCount(true),
      },
      useSync ? {
        title: t('syncRemote'),
        icon: <SyncIcon />,
        badgeContent: syncNotification ? '!' : null,
        badgeColor: NavBadgeColor.ERROR,
        disabled: syncBusy,
        isBusy: false,
        onClick: selectSync,
      } : null,
      {
        title: themeName === ThemeName.BRIGHT ? t('switchToDark') : t('switchToBright'),
        icon: themeName === ThemeName.BRIGHT ? <LightModeIcon /> : <DarkModeIcon />,
        badgeContent: null,
        badgeColor: NavBadgeColor.DEFAULT,
        disabled: false,
        isBusy: false,
        onClick: () => setThemeName(themeName === ThemeName.BRIGHT ? ThemeName.DARK : ThemeName.BRIGHT),
      },
      useSerials ? {
        title: disableSerials ? t('usbDisabled') : t('usbDevices'),
        icon: <UsbIcon />,
        badgeContent: ((serialWarning && '!') || (portCount && portCount.toString(10)) || null),
        badgeColor: serialWarning ? NavBadgeColor.ERROR : NavBadgeColor.INFO,
        disabled: disableSerials,
        isBusy: isReceiving,
        onClick: setShowSerials,
      } : null,
    ].reduce(reduceItems<NavActionItem>, [])
  ), [
    disableSerials,
    portCount,
    selectSync,
    serialWarning,
    setShowSerials,
    setThemeName,
    showTrashCount,
    trashBusy,
    syncBusy,
    syncNotification,
    t,
    themeName,
    trashCountSum,
    useSerials,
    useSync,
    isReceiving,
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
                aria-label={t('mainNavAriaLabel')}
                sx={{ display: { xs: 'none', md: 'inline-flex' }, width: '100%' }}
              >
                {navItems.map(({ route, label, prefetch }) => (
                  <Button
                    key={route}
                    href={route}
                    prefetch={prefetch}
                    component={Link}
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
                aria-label={t('utilityNavAriaLabel')}
              >
                {navActionItems.map(({ title, icon, onClick, badgeContent, badgeColor, isBusy, disabled }) => (
                  <IconButton
                    key={title}
                    color="inherit"
                    disabled={disabled}
                    title={title}
                    onClick={onClick}
                    sx={isBusy ? { animation: 'pulse-bg 600ms infinite' } : undefined}
                  >
                    <Badge
                      badgeContent={badgeContent}
                      color={badgeColor}
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
                  title={t('openMainNav')}
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
              title={t('closeMainNav')}
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
                href={route}
                component={Link}
                onClick={() => setMobileNavOpen(false)}
                sx={(theme: Theme) => ({
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
