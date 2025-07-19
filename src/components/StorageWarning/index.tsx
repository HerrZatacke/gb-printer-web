import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import bytes from 'bytes';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useStorageInfo } from '@/hooks/useStorageInfo';

function StorageWarning() {
  const t = useTranslations('StorageWarning');
  const { storageEstimate } = useStorageInfo();

  if (!storageEstimate) {
    return null;
  }

  // Get the translated storage type label
  const storageType = t(`storageTypes.${storageEstimate.type}`);

  return (
    <Box
      title={t('usageTooltip', { used: bytes(storageEstimate.used) || '', total: bytes(storageEstimate.total) || '' })}
      sx={{ position: 'relative' }}
    >
      <LinearProgress
        variant="determinate"
        value={storageEstimate.percentage}
        sx={{ width: '100%', height: '34px' }}
        color="error"
      />
      <Typography
        variant="body2"
        color="bg"
        sx={{
          position: 'absolute',
          p: 1,
          top: 0,
        }}
      >
        {t('usageWarning', {
          percentage: storageEstimate.percentage,
          type: storageType,
        })}
      </Typography>
    </Box>
  );
}

export default StorageWarning;
