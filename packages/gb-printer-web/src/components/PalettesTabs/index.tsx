'use client';

import { Tab, Tabs } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import WrappedNextLink from '@/components/WrappedNextLink';
import { useNavigationItems } from '@/contexts/NavigationItemsContext';

function PalettesTabs() {
  const pathName = usePathname();

  const { palettesTabs } = useNavigationItems();

  const tabsValue = useMemo<string | null>(() => {
    if (
      pathName === '/palettes' ||
      palettesTabs.findIndex(({ route }) => (route === pathName)) === -1
    ) {
      return null;
    }

    return pathName;
  }, [pathName, palettesTabs]);

  if (!tabsValue) {
    return null;
  }

  return (
    <Tabs value={tabsValue}>
      {
        palettesTabs.map(({ label, route }) => (
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

export default PalettesTabs;
