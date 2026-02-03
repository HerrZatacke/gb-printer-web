import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import { useProgressStore } from '@/stores/stores';

function ProgressBox() {
  const t = useTranslations('ProgressBox');
  const { progress } = useProgressStore();

  return (
    <Lightbox
      header={t('dialogHeader')}
    >
      <Stack
        direction="column"
        gap={2}
      >
        { progress.map((progressItem) => (
          <Stack
            key={progressItem.id}
            direction="column"
            gap={1}
          >
            <Typography>{ progressItem.label }</Typography>
            <LinearProgress
              variant="determinate"
              value={progressItem.value * 100}
              color="secondary"
            />
          </Stack>
        )) }
      </Stack>
    </Lightbox>
  );
}

export default ProgressBox;
