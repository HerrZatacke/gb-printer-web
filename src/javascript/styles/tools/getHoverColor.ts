import type { Palette, PaletteColor } from '@mui/material/styles/createPalette';

export const getHoverColor = (palette: Palette, color: PaletteColor) => (
  color[palette.mode]
);
