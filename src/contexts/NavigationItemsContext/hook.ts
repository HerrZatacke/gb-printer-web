import DarkModeIcon from '@mui/icons-material/DarkMode';
import DeleteIcon from '@mui/icons-material/Delete';
import LightModeIcon from '@mui/icons-material/LightMode';
import SyncIcon from '@mui/icons-material/Sync';
import UsbIcon from '@mui/icons-material/Usb';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { ThemeName } from '@/consts/theme';
import { useEnv } from '@/contexts/envContext';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { usePortsContext } from '@/contexts/PortsContext';
import useNavigation from '@/hooks/useNavigation';
import { useUrl } from '@/hooks/useUrl';
import { useInteractionsStore, useSettingsStore } from '@/stores/stores';
import { reduceItems } from '@/tools/reduceArray';
import sortBy from '@/tools/sortby';
import { FeatureFlag } from '@/types/FeatureFlags';
import { NavActionItem, NavBadgeColor, NavItem } from '@/types/Navigation';

const sortByLabel = sortBy<NavItem>('label');

export interface NavigationItemsContextType {
  mainNavigationItems: NavItem[];
  mainNavigationActionItems: NavActionItem[];
  settingsTabs: NavItem[];
  palettesTabs: NavItem[];
}

export const useContextHook = (): NavigationItemsContextType => {
  const tNavigation = useTranslations('Navigation');
  const tSettingsTabs = useTranslations('SettingsTabs');
  const tPalettes = useTranslations('Palettes');
  const { fullPath } = useUrl();
  const { lastGalleryLink, getUrl, paths } = useGalleryTreeContext();
  const [galleryRoute, setGalleryRoute] = useState(getUrl({ pageIndex: 0, group: '' }));
  const { themeName, setThemeName } = useSettingsStore();
  const { showTrashCount, trashCount, trashBusy } = useInteractionsStore();
  const { featureFlags } = useSettingsStore();
  const env = useEnv();


  const {
    disableSerials,
    serialWarning,
    portCount,
    syncBusy,
    syncLastUpdate,
    autoDropboxSync,
    useSync,
    useSerials,
    selectSync,
    setShowSerials,
  } = useNavigation();

  const { isReceiving } = usePortsContext();


  const trashCountSum = useMemo(() => (trashCount.frames + trashCount.images), [trashCount]);

  const syncNotification = useMemo(() => (
    autoDropboxSync && (syncLastUpdate.local !== syncLastUpdate.dropbox)
  ), [autoDropboxSync, syncLastUpdate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      // Set "galleryRoute" on client side only to prevent hydration issues
      setGalleryRoute(lastGalleryLink && fullPath !== lastGalleryLink ? lastGalleryLink : getUrl({ pageIndex: 0, group: '' }));
    }, 1);

    return () => window.clearTimeout(handle);
  }, [fullPath, getUrl, lastGalleryLink]);

  const settingsTabs = useMemo<NavItem[]>(() => (
    [
      {
        route: '/settings/generic/',
        label: tSettingsTabs('genericSettings'),
      },
      (
        process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID &&
        process.env.NEXT_PUBLIC_GOOGLE_SCOPE &&
        featureFlags.includes(FeatureFlag.GAPI_SHEETS)
      ) ?
        {
          route: '/settings/gsheets/',
          label: tSettingsTabs('gapiSheetsSettings'),
        } : null,
      process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ?
        {
          route: '/settings/dropbox/',
          label: tSettingsTabs('dropboxSettings'),
        } : null,
      (
        (env?.env === 'esp8266') ||
        (env?.env === 'webpack-dev')
      ) ? {
        route: '/settings/wifi/',
        label: tSettingsTabs('wifiSettings'),
      } : null,
      {
        route: '/settings/plugins/',
        label: tSettingsTabs('pluginSettings'),
      },
      {
        route: '/settings/git/',
        label: tSettingsTabs('gitSettings'),
      },
    ]
      .reduce(reduceItems<NavItem>, [])
  ), [tSettingsTabs, featureFlags, env?.env]);

  const palettesTabs: NavItem[] = useMemo<NavItem[]>(() => (
    [
      {
        route: '/palettes/own/',
        label: tPalettes('ownPalettes'),
      },
      {
        route: '/palettes/predefined/',
        label: tPalettes('predefinedPalettes'),
      },
      {
        route: '/palettes/all/',
        label: tPalettes('allPalettes'),
      },
    ]
  ), [tPalettes]);

  const galleryShortcuts: NavItem[] = useMemo(() => {
    const favouriteGroups = paths
      .filter((pathMap) => (
        pathMap.group.isFavourite
      ))
      .map((pathMap): NavItem => ({
        label: pathMap.group.title,
        route: getUrl({
          group: pathMap.absolutePath,
        }),
      }));

    return sortByLabel(favouriteGroups);
  }, [getUrl, paths]);

  const mainNavigationItems = useMemo<NavItem[]>(() => (
    [
      {
        label: tNavigation('home'),
        route: '/',
      },
      {
        label: tNavigation('gallery'),
        route: galleryRoute,
        children: [{
          headline: tNavigation('galleryShortcuts'),
          navItems: galleryShortcuts,
          sizeFlyout: { xs: 12, lg: 6 },
        }]
          .filter(({ navItems }) => navItems.length),
      },
      {
        label: tNavigation('import'),
        route: '/import',
      },
      {
        label: tNavigation('palettes'),
        route: '/palettes',
        children: [{
          headline: tNavigation('palettes'),
          navItems: palettesTabs,
          sizeFlyout: { xs: 12, lg: 6 },
        }],
      },
      {
        label: tNavigation('frames'),
        route: '/frames',
      },
      {
        label: tNavigation('settings'),
        route: '/settings',
        children: [{
          headline: tNavigation('settings'),
          navItems: settingsTabs,
          sizeFlyout: { xs: 12, lg: 6 },
        }],
      },
    ].reduce(reduceItems<NavItem>, [])
  ), [galleryRoute, galleryShortcuts, palettesTabs, settingsTabs, tNavigation]);


  const mainNavigationActionItems = useMemo<NavActionItem[]>(() => (
    [
      {
        title: tNavigation('trash'),
        Icon: DeleteIcon,
        badgeContent: trashCountSum > 0 ? trashCountSum.toString(10) : null,
        badgeColor: NavBadgeColor.ERROR,
        disabled: trashBusy,
        isBusy: trashBusy,
        onClick: () => showTrashCount(true),
      },
      useSync ? {
        title: tNavigation('syncRemote'),
        Icon: SyncIcon,
        badgeContent: syncNotification ? '!' : null,
        badgeColor: NavBadgeColor.ERROR,
        disabled: syncBusy,
        isBusy: false,
        onClick: selectSync,
      } : null,
      {
        title: themeName === ThemeName.BRIGHT ? tNavigation('switchToDark') : tNavigation('switchToBright'),
        Icon: themeName === ThemeName.BRIGHT ? LightModeIcon : DarkModeIcon,
        badgeContent: null,
        badgeColor: NavBadgeColor.DEFAULT,
        disabled: false,
        isBusy: false,
        onClick: () => setThemeName(themeName === ThemeName.BRIGHT ? ThemeName.DARK : ThemeName.BRIGHT),
      },
      useSerials ? {
        title: disableSerials ? tNavigation('usbDisabled') : tNavigation('usbDevices'),
        Icon: UsbIcon,
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
    tNavigation,
    themeName,
    trashCountSum,
    useSerials,
    useSync,
    isReceiving,
  ]);

  return {
    mainNavigationItems,
    mainNavigationActionItems,
    settingsTabs,
    palettesTabs,
  };
};
