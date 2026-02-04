'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useEnv } from '@/contexts/envContext';
import { reduceItems } from '@/tools/reduceArray';

interface Tab {
  path: string,
  headline: string,
  prefetch: boolean,
}

function SettingsTabs() {
  const pathName = usePathname();
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
        process.env.NEXT_PUBLIC_GOOGLE_SCOPES
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
  ), [t, env]);

  const tabsValue = useMemo<string | null>(() => {
    if (
      !tabs.length ||
      pathName === '/settings'
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
