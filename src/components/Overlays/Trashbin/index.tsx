import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import useTrashbin from '@/hooks/useTrashbin';

function Trashbin() {
  const t = useTranslations('Trashbin');
  const {
    showTrashCount,
    purgeTrash,
    downloadImages,
    downloadFrames,
    trashCount,
  } = useTrashbin();

  const sum = trashCount.frames + trashCount.images;

  return (
    <Lightbox
      deny={() => {
        showTrashCount(false);
      }}
      header={t('dialogHeader', { count: sum })}
      contentWidth="auto"
      actionButtons={(
        <>
          <Button
            variant="contained"
            color="secondary"
            title={t('downloadFrames', { count: 0 })}
            disabled={trashCount.frames === 0}
            onClick={downloadFrames}
          >
            {t('downloadFrames', { count: trashCount.frames })}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            title={t('downloadImages', { count: 0 })}
            disabled={trashCount.images === 0}
            onClick={downloadImages}
          >
            {t('downloadImages', { count: trashCount.images })}
          </Button>
          <Button
            variant="contained"
            color="error"
            title={t('purgeAll', { count: 0 })}
            disabled={sum === 0}
            onClick={purgeTrash}
          >
            {t('purgeAll', { count: sum })}
          </Button>
        </>
      )}
    >
      <Stack
        direction="column"
        gap={2}
      >
        <Typography variant="body2">
          {t('deletedFrames', { count: trashCount.frames })}
        </Typography>
        <Typography variant="body2">
          {t('deletedImages', { count: trashCount.images })}
        </Typography>
      </Stack>
    </Lightbox>
  );
}

export default Trashbin;
