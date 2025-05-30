import type { SxProps, Theme } from '@mui/material/styles';
import { hexToRgbString } from '@/tools/hexToRgbString';

export enum GradientType {
  HARD = 'HARD',
  SMOOTH = 'SMOOTH',
  CONIC = 'CONIC',
}

export const generateGradient = (paletteColors: string[], type: GradientType): SxProps<Theme> => {
  const opacity = 0.25;
  const g1 = hexToRgbString(paletteColors[0] || '#000000');
  const g2 = hexToRgbString(paletteColors[1] || '#000000');
  const g3 = hexToRgbString(paletteColors[2] || '#000000');
  const g4 = hexToRgbString(paletteColors[3] || '#000000');

  switch (type) {
    case GradientType.SMOOTH: {
      return {
        backgroundImage: `linear-gradient(to right,
          rgba(${g1}, ${opacity}) 0%,
          rgba(${g2}, ${opacity}) 33.3%,
          rgba(${g3}, ${opacity}) 66.6%,
          rgba(${g4}, ${opacity}) 100%
      )`,
      };
    }

    case GradientType.HARD: {
      return {
        backgroundImage: `linear-gradient(to right,
          rgb(${g1}) 0% 25%,
          rgb(${g2}) 25% 50%,
          rgb(${g3}) 50% 75%,
          rgb(${g4}) 75% 100%
        )`,
      };
    }

    case GradientType.CONIC: {
      return {
        background: `conic-gradient(
          rgb(${g1}) 0% 25%,
          rgb(${g2}) 25% 50%,
          rgb(${g3}) 50% 75%,
          rgb(${g4}) 75% 100%
        )`,
      };
    }

    default:
      return {};
  }
};
