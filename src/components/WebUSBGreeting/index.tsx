'use client';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import MuiMarkdown from 'mui-markdown';
import React from 'react';
import MarkdownStack from '@/components/MarkdownStack';
import ConnectSerial from '@/components/Overlays/ConnectSerial';
import useSettingsStore from '@/stores/settingsStore';
import WebSerial from '@/tools/WebSerial';
import WebUSBSerial from '@/tools/WebUSBSerial';
import EnableWebUSB from './EnableWebUSB';
import readme from './WebUSB.md';

function WebUSBGreeting() {
  const { useSerials } = useSettingsStore();

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
          <ConnectSerial inline passive />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            gap={4}
            sx={{ '& > *': { flex: 1 } }}
          >
            <Alert
              severity={WebSerial.enabled ? 'success' : 'warning'}
              variant="filled"
            >
              {WebSerial.enabled ? 'Your current browser/device does support Web Serial' : 'Your current browser/device does not support Web Serial'}
            </Alert>
            <Alert
              severity={WebUSBSerial.enabled ? 'success' : 'warning'}
              variant="filled"
            >
              {WebUSBSerial.enabled ? 'Your current browser/device does support WebUSB' : 'Your current browser/device does not support WebUSB'}
            </Alert>
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default WebUSBGreeting;
