import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ConnectSerial from '../Overlays/ConnectSerial';
import AsyncMarkdown from '../AsyncMarkdown';
import EnableWebUSB from './EnableWebUSB';
import useSettingsStore from '../../stores/settingsStore';
import WebSerial from '../../../tools/WebSerial';
import WebUSBSerial from '../../../tools/WebUSBSerial';

function WebUSBGreeting() {
  const { useSerials } = useSettingsStore();

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <EnableWebUSB />
      {!useSerials ? null : (
        <>
          <ConnectSerial inline passive />
          <AsyncMarkdown
            getMarkdown={async () => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const { default: rawMd } = await import(/* webpackChunkName: "doc" */ './WebUSB.md');
              return rawMd;
            }}
          />
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
