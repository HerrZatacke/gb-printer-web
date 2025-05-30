'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';
import EnvInfo from '@/components/EnvInfo';
import ExportSettings from '@/components/ExportSettings';
import SettingsTabs from '@/components/SettingsTabs';
import { useIdle } from '@/hooks/useIdle';

export default function SettingsLayout({ children }: Readonly<PropsWithChildren>) {
  const isIdle = useIdle();

  return (
    <>
      <Typography
        component="h1"
        variant="h1"
      >
        Settings
      </Typography>
      {isIdle && (
        <Stack
          direction="column"
          gap={4}
          justifyContent="space-between"
          sx={{ flexGrow: 1 }}
        >
          <Stack
            direction="column"
            gap={6}
          >
            <SettingsTabs/>
            <Box>{children}</Box>
            <ExportSettings />
          </Stack>

          <EnvInfo />
        </Stack>
      )}
    </>
  );
};
