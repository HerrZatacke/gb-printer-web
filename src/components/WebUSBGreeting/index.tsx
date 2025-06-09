'use client';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import MuiMarkdown from 'mui-markdown';
import React from 'react';
import MarkdownStack from '@/components/MarkdownStack';
import ConnectSerial from '@/components/Overlays/ConnectSerial';
import { usePortsContext } from '@/contexts/ports';
import useSettingsStore from '@/stores/settingsStore';
import EnableWebUSB from './EnableWebUSB';
import readme from './WebUSB.md';

function WebUSBGreeting() {
  const { useSerials } = useSettingsStore();
  const { webSerialEnabled, webUSBEnabled } = usePortsContext();

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <MuiMarkdown options={{ wrapper: MarkdownStack }}>
        {readme}
      </MuiMarkdown>
      <EnableWebUSB />
      {!useSerials ? null : (
        <>
          <ConnectSerial inline />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            gap={4}
            sx={{ '& > *': { flex: 1 } }}
          >
            <Alert
              severity={webUSBEnabled ? 'success' : 'warning'}
              variant="filled"
            >
              {webUSBEnabled ? 'Your current browser/device does support WebUSB' : 'Your current browser/device does not support WebUSB'}
            </Alert>
            <Alert
              severity={webSerialEnabled ? 'success' : 'warning'}
              variant="filled"
            >
              {webSerialEnabled ? 'Your current browser/device does support Web Serial' : 'Your current browser/device does not support Web Serial'}
            </Alert>
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default WebUSBGreeting;
