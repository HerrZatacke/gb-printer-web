'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { filesize } from 'filesize';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useStorageInfo } from '@/hooks/useStorageInfo';

function EnvInfo() {
  const t = useTranslations('EnvInfo');
  const { storageEstimate } = useStorageInfo();

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
    ]);
  }, [storageEstimate, t]);

  return (
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
          lineHeight={1.25}
        >
          {text}
        </Typography>
      )) }
    </Stack>
  );
}

export default EnvInfo;
