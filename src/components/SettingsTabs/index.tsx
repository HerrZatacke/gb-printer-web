'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  const tabs = useMemo<Tab[]>(() => (
    [
      {
        path: '/settings/generic/',
        headline: 'Generic Settings',
        prefetch: true,
      },
      process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ?
        {
          path: '/settings/dropbox/',
          headline: 'Dropbox Settings',
          prefetch: false,
        } : null,
      (
        (env?.env === 'esp8266') ||
        (env?.env === 'webpack-dev')
      ) ? {
        path: '/settings/wifi/',
        headline: 'WiFi Settings',
        prefetch: false,
      } : null,
      {
        path: '/settings/plugins/',
        headline: 'Plugin Settings',
        prefetch: false,
      },
      {
        path: '/settings/git/',
        headline: 'Git Settings',
        prefetch: false,
      },
    ]
      .reduce(reduceItems<Tab>, [])
  ), [env]);

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
