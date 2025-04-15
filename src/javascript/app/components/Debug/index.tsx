import React from 'react';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/system';
import useSettingsStore from '../../stores/settingsStore';
import { getPreStyles } from '../../../styles/tools/getPreStyles';

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
      component="pre"
      sx={(theme: Theme) => getPreStyles(theme, {
        px: 0.5,
        py: 0,
        mx: -0.5,
        mt: 1,
        mb: 0,
        backgroundColor: theme.palette.warning[theme.palette.mode],
      })}
    >
      { children }
    </Typography>
  );
}

export default Debug;
