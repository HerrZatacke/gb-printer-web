import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/system';
import React from 'react';
import { useSettingsStore } from '@/stores/stores';
import { getPreStyles } from '@/styles/tools/getPreStyles';

interface Props {
  text: string,
}


function Debug({ text }: Props) {
  const { enableDebug } = useSettingsStore();

  if (!enableDebug) {
    return null;
  }

  return (
    <Typography
      title={text}
      variant="caption"
      fontFamily="monospace"
      component="pre"
      sx={(theme: Theme) => getPreStyles(theme, {
        px: 0.5,
        py: 0,
        mt: 1,
        mb: 0,
        backgroundColor: theme.palette.warning[theme.palette.mode],
      })}
    >
      { text }
    </Typography>
  );
}

export default Debug;
