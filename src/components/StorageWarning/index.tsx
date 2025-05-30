import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import bytes from 'bytes';
import React from 'react';
import { useStorageInfo } from '@/hooks/useStorageInfo';


const storageLabel = (key: string) => {
  switch (key) {
    case 'indexedDB':
      return 'indexed DB';
    case 'localStorage':
      return 'local storage';
    default:
      return key;
  }
};

function StorageWarning() {
  const { storageEstimate } = useStorageInfo();

  if (!storageEstimate) {
    return null;
  }

  return (
    <Box
      title={`Using ${bytes(storageEstimate.used)} of ${bytes(storageEstimate.total)}`}
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
        { `You are using ${storageEstimate.percentage}% of your browser's ${storageLabel(storageEstimate.type)}. Be aware for now saving images will not be possible once you hit the limit.` }
      </Typography>
    </Box>
  );
}

export default StorageWarning;
