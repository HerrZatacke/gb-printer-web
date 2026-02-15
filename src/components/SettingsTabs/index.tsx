'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useEnv } from '@/contexts/envContext';
import { useSettingsStore } from '@/stores/stores';
import { reduceItems } from '@/tools/reduceArray';
import { FeatureFlag } from '@/types/FeatureFlags';

interface Tab {
  path: string,
  headline: string,
  prefetch: boolean,
}

function SettingsTabs() {
  const pathName = usePathname();
  const { featureFlags } = useSettingsStore();
  const env = useEnv();
  const t = useTranslations('SettingsTabs');

  const tabs = useMemo<Tab[]>(() => (
    [
      {
        path: '/settings/generic/',
        headline: t('genericSettings'),
        prefetch: true,
      },
      (
        process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID &&
        process.env.NEXT_PUBLIC_GOOGLE_SCOPE &&
        featureFlags.includes(FeatureFlag.GAPI_SHEETS)
      ) ?
        {
          path: '/settings/gsheets/',
          headline: t('gapiSheetsSettings'),
          prefetch: false,
        } : null,
      process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ?
        {
          path: '/settings/dropbox/',
          headline: t('dropboxSettings'),
          prefetch: false,
        } : null,
      (
        (env?.env === 'esp8266') ||
        (env?.env === 'webpack-dev')
      ) ? {
        path: '/settings/wifi/',
        headline: t('wifiSettings'),
        prefetch: false,
      } : null,
      {
        path: '/settings/plugins/',
        headline: t('pluginSettings'),
        prefetch: false,
      },
      {
        path: '/settings/git/',
        headline: t('gitSettings'),
        prefetch: false,
      },
    ]
      .reduce(reduceItems<Tab>, [])
  ), [t, featureFlags, env?.env]);

  const tabsValue = useMemo<string | null>(() => {
    if (
      !tabs.length ||
      pathName === '/settings' ||
      tabs.findIndex(({ path }) => (path === pathName)) === -1
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
        tabs.map(({ headline, path, prefetch }) => (
          <Tab
            label={headline}
            key={path}
            component={Link}
            href={path}
            prefetch={prefetch}
            value={path}
          />
        ))
      }
    </Tabs>
    );
}

export default SettingsTabs;
