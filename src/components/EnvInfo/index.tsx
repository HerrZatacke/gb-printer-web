'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import filesize from 'filesize';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useEnv } from '@/contexts/envContext';
import { useStorageInfo } from '@/hooks/useStorageInfo';

function EnvInfo() {
  const env = useEnv();
  const t = useTranslations('EnvInfo');
  const { storageEstimate } = useStorageInfo();

  const infos = useMemo<string[]>(() => {
    if (!env) {
      return [];
    }

    return ([
      t('appVersion', { value: process.env.NEXT_PUBLIC_VERSION || '' }),
      t('appBranch', { value: process.env.NEXT_PUBLIC_BRANCH || '' }),
      t('printerVersion', { value: env.version }),
      t('maxImages', { value: env.maximages }),
      t('storageDriver', { value: env.localforage }),
      ...storageEstimate.map((estimate) => (
        t('storageEstimate', {
          type: estimate.type,
          total: filesize(estimate.total),
          used: filesize(estimate.used),
          percentage: estimate.percentage,
        })
      )),
      t('envType', { value: env.env }),
      t('filesystem', { value: env.fstype }),
      t('bootmode', { value: env.bootmode }),
      t('hasOled', { value: env.oled ? t('yes') : t('no') }),
    ]);
  }, [env, storageEstimate, t]);

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
