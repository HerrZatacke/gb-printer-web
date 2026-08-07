'use client';

import HelpIcon from '@mui/icons-material/Help';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { filesize } from 'filesize';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useStorageInfo } from '@/hooks/useStorageInfo';

function EnvInfo() {
  const t = useTranslations('EnvInfo');
  const [showLSInfo, setShowLSInfo] = useState(false);
  const { storageEstimate, localStorageUsageItems } = useStorageInfo();

  const infos = useMemo<string[]>(() => {
    return ([
      t('appVersion', { value: process.env.NEXT_PUBLIC_VERSION || '' }),
      t('appBranch', { value: process.env.NEXT_PUBLIC_BRANCH || '' }),
      ...storageEstimate.map((estimate) => (
        t('storageEstimate', {
          type: estimate.type,
          total: filesize(estimate.total),
          used: filesize(estimate.used),
          percentage: estimate.percentage.toFixed(2),
        })
      )),
      ...(showLSInfo ? localStorageUsageItems.map(({ key, size }) => (
        `${key}: ${filesize(size)}`
      )) : []),
    ]);
  }, [localStorageUsageItems, showLSInfo, storageEstimate, t]);

  return (
    <Stack
      component="ul"
      direction="column"
    >
      { infos.map((text) => (
        <Stack
          key={text}
          component="li"
          direction="row"
          sx={{
            justifyContent: 'end',
            gap: 1,
          }}
        >
          {text.includes('localStorage') ? (
            <button
              tabIndex={-1}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer',
              }}
              onClick={() => setShowLSInfo(!showLSInfo)}
            >
              <HelpIcon sx={{ fontSize: 14 }} color="action" />
            </button>
          ) : null}
          <Typography
            variant="caption"
            color="textDisabled"
            align="right"
            sx={{
              lineHeight: 1.25,
            }}
          >
            {text}
          </Typography>
        </Stack>
      )) }
    </Stack>
  );
}

export default EnvInfo;
