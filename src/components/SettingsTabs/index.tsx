'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useEnv } from '@/contexts/envContext';
import { useSettingsStore } from '@/stores/stores';
import { reduceItems } from '@/tools/reduceArray';
import { FeatureFlag } from '@/types/FeatureFlags';
import { NavItem } from '@/types/Navigation';

function SettingsTabs() {
  const pathName = usePathname();
  const { featureFlags } = useSettingsStore();
  const env = useEnv();
  const t = useTranslations('SettingsTabs');

  const tabs = useMemo<NavItem[]>(() => (
    [
      {
        route: '/settings/generic/',
        label: t('genericSettings'),
      },
      (
        process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID &&
        process.env.NEXT_PUBLIC_GOOGLE_SCOPE &&
        featureFlags.includes(FeatureFlag.GAPI_SHEETS)
      ) ?
        {
          route: '/settings/gsheets/',
          label: t('gapiSheetsSettings'),
        } : null,
      process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ?
        {
          route: '/settings/dropbox/',
          label: t('dropboxSettings'),
        } : null,
      (
        (env?.env === 'esp8266') ||
        (env?.env === 'webpack-dev')
      ) ? {
        route: '/settings/wifi/',
        label: t('wifiSettings'),
      } : null,
      {
        route: '/settings/plugins/',
        label: t('pluginSettings'),
      },
      {
        route: '/settings/git/',
        label: t('gitSettings'),
      },
    ]
      .reduce(reduceItems<NavItem>, [])
  ), [t, featureFlags, env?.env]);

  const tabsValue = useMemo<string | null>(() => {
    if (
      !tabs.length ||
      pathName === '/settings' ||
      tabs.findIndex(({ route }) => (route === pathName)) === -1
    ) {
      return null;
    }

    return pathName;
  }, [pathName, tabs]);

  if (!tabsValue) {
    return null;
  }

  return (
    <Tabs value={tabsValue}>
      {
        tabs.map(({ label, route }) => (
          <Tab
            label={label}
            key={route}
            component={NextLink}
            href={route}
            prefetch={false}
            value={route}
          />
        ))
      }
    </Tabs>
    );
}

export default SettingsTabs;
