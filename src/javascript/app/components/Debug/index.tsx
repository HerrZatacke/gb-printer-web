import React from 'react';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/system';
import useSettingsStore from '../../stores/settingsStore';

interface Props {
  children: React.ReactNode,
}


function Debug({ children }: Props) {
  const { enableDebug } = useSettingsStore();

  if (!enableDebug) {
    return null;
  }

  return (
    <Typography
      variant="caption"
      fontFamily="monospace"
      sx={(theme: Theme) => ({
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        backgroundColor: theme.palette.warning[theme.palette.mode],
        borderRadius: '3px',
        px: 0.5,
        mx: -0.5,
        mt: 1,
        mb: 0,
      })}
    >
      { children }
    </Typography>
  );
}

export default Debug;
