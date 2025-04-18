import React from 'react';
import { Outlet, NavLink, useMatches, Navigate } from 'react-router';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import ExportSettings from './pages/ExportSettings';
import { getEnv } from '../../../tools/getEnv';

const env = getEnv();

const infos: string[] = [
  `Web-App version: ${VERSION}`,
  `Web-App branch: ${BRANCH}`,
  `Printer version: ${env?.version}`,
  `Max Images: ${env?.maximages}`,
  `Localforage driver: ${env?.localforage}`,
  `Environment type: ${env?.env}`,
  `Compiled Filesystem: ${env?.fstype}`,
  `Compiled Bootmode: ${env?.bootmode}`,
  `Compiled for OLED: ${env?.oled ? 'yes' : 'no'}`,
];

const tabs = [
  {
    path: '/settings/generic',
    headline: 'Generic Settings',
  },
  {
    path: '/settings/git',
    headline: 'Git Settings',
  },
  {
    path: '/settings/plugins',
    headline: 'Plugin Settings',
  },
];

if (DROPBOX_APP_KEY) {
  tabs.push({
    path: '/settings/dropbox',
    headline: 'Dropbox Settings',
  });
}

if (
  (getEnv()?.env === 'esp8266') ||
  (getEnv()?.env === 'webpack-dev')
) {
  tabs.push({
    path: '/settings/wifi',
    headline: 'WiFi Settings',
  });
}

function Settings() {
  const matches = useMatches();
  const pathname = matches[2]?.pathname;

  const tab = tabs.find(({ path }) => path === pathname);

  if (!tab) {
    return <Navigate to={tabs[0].path} replace />;
  }

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <Tabs value={pathname}>
        {
          tabs.map(({ headline, path }) => (
            <Tab
              label={headline}
              key={path}
              component={NavLink}
              to={path}
              value={path}
              // className={({ isActive }) => ( /* ToDo */ }
            />
          ))
        }
      </Tabs>

      <Box>
        <Outlet />
      </Box>

      <ExportSettings />

      <Stack
        component="ul"
        direction="column"
      >
        { infos.map((text) => (
          <Typography
            key={text}
            component="li"
            variant="caption"
            color="textDisabled"
            align="right"
          >
            {text}
          </Typography>
        )) }
      </Stack>
    </Stack>
  );
}

export default Settings;
