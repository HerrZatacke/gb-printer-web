'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useEnv } from '@/contexts/envContext';

function EnvInfo() {
  const env = useEnv();
  const infos = useMemo<string[]>(() => {
    if (!env) {
      return [];
    }

    return ([
      `Web-App version: ${process.env.NEXT_PUBLIC_BRANCH}`,
      `Web-App branch: ${process.env.NEXT_PUBLIC_VERSION}`,
      `Printer version: ${env.version}`,
      `Max Images: ${env.maximages}`,
      `Localforage driver: ${env.localforage}`,
      `Environment type: ${env.env}`,
      `Compiled Filesystem: ${env.fstype}`,
      `Compiled Bootmode: ${env.bootmode}`,
      `Compiled for OLED: ${env.oled ? 'yes' : 'no'}`,
    ]);
  }, [env]);

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
