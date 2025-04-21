import React from 'react';
import Box from '@mui/material/Box';
import { generateGradient, GradientType } from '../../../tools/generateGradient';

interface Props {
  palette: string[],
  fontSize?: string,
}

function PaletteIcon({
  palette,
  fontSize,
}: Props) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        fontSize: fontSize || '2rem',
        width: '1em',
        height: '1em',
        lineHeight: '1em',
        verticalAlign: 'middle',
        borderRadius: '50%',
        ...generateGradient(palette, GradientType.CONIC),
        '&:hover': {
          animation: 'spin 800ms infinite linear',
        },
      }}
    />
  );
}

export default PaletteIcon;
