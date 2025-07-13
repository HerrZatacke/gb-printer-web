'use client';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import MuiMarkdown from 'mui-markdown';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import MarkdownStack from '@/components/MarkdownStack';
import ConnectSerial from '@/components/Overlays/ConnectSerial';
import { usePortsContext } from '@/contexts/ports';
import useSettingsStore from '@/stores/settingsStore';
import EnableWebUSB from './EnableWebUSB';
import readmeEn from './WebUSB.en.md';

function WebUSBGreeting() {
  const { useSerials } = useSettingsStore();
  const { webSerialEnabled, webUSBEnabled } = usePortsContext();
  const { preferredLocale } = useSettingsStore();
  const t = useTranslations('WebUSBGreeting');

  const [readme, setReadme] = useState(readmeEn);

  useEffect(() => {
    const set = async () => {
      let langFile = preferredLocale.split('-')[0];

      if (!['de', 'en'].includes(langFile)) {
        langFile = 'en';
      }

      try {
        setReadme((await import(`./WebUSB.${langFile}.md`)).default);
      } catch {
        setReadme(readmeEn);
      }
    };

    set();
  }, [preferredLocale]);

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
              {t(webUSBEnabled ? 'webUSBEnabled' : 'webUSBDisabled')}
            </Alert>
            <Alert
              severity={webSerialEnabled ? 'success' : 'warning'}
              variant="filled"
            >
              {t(webSerialEnabled ? 'webSerialEnabled' : 'webSerialDisabled')}
            </Alert>
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default WebUSBGreeting;
