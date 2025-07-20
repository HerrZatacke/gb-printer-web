import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { alpha } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';

function DragOver() {
  const theme = useTheme();
  const t = useTranslations('DragOver');

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 30,
        background: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(6px)',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          px: { xs: 6, md: 10 },
          py: { xs: 4, md: 9 },
        }}
      >
        <Stack
          direction="column"
          gap={4}
          alignItems="center"
          color={theme.palette.tertiary.main}
        >
          <CloudUploadIcon sx={{ fontSize: 64 }} />
          <Typography variant="h5" fontWeight="bold">
            {t('dropFilesHere')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ maxWidth: '70vw' }}
            textAlign="center"
          >
            {t('supportedFileTypes')}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default DragOver;
