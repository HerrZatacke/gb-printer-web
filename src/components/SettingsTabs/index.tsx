'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import useNavigationItems from '@/contexts/NavigationItemsContext';

function SettingsTabs() {
  const pathName = usePathname();

  const { settingsTabs } = useNavigationItems();

  const tabsValue = useMemo<string | null>(() => {
    if (
      !settingsTabs.length ||
      pathName === '/settings' ||
      settingsTabs.findIndex(({ route }) => (route === pathName)) === -1
    ) {
      return null;
    }

    return pathName;
  }, [pathName, settingsTabs]);

  if (!tabsValue) {
    return null;
  }

  return (
    <Tabs value={tabsValue}>
      {
        settingsTabs.map(({ label, route }) => (
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
