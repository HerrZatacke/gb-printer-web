'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import WrappedNextLink from '@/components/WrappedNextLink';
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
            component={WrappedNextLink}
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
