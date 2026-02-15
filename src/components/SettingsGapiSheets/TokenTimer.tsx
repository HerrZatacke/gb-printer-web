import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useStoragesStore } from '@/stores/stores';

function TokenTimer() {
  const t = useTranslations('SettingsGapiSheets');
  const [expiryTimeInfo, setExpiryTimeInfo] = useState<string>('');
  const { gapiStorage } = useStoragesStore();

  useEffect(() => {
    const handle = setInterval(() => {

      const expiresInMs = (gapiStorage.tokenExpiry || 0) - Date.now();
      if (expiresInMs <= 0) {
        setExpiryTimeInfo('N/A');
        return;
      }

      const expiryInfo = (new Date(expiresInMs))
        .toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        });

      setExpiryTimeInfo(expiryInfo);
    }, 1000);

    return () => clearInterval(handle);
  }, [gapiStorage.tokenExpiry]);

  return (
    <Typography>
      {t('tokenExpiry', { time: expiryTimeInfo })}
    </Typography>
  );
}

export default TokenTimer;
